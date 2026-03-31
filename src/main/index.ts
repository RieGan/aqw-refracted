/** biome-ignore-all lint/style/useNodejsImportProtocol: we need to use node.js import protocol for fs */

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { readFileSync } from 'fs'
import { basename, join } from 'path'
import {
  OFFSCREEN_X,
  OFFSCREEN_Y,
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  WINDOW_WIDTH,
} from './constants'
import { attachDebugger } from './debugger'
import { type ClickPosition, clickElement, focusElement, keyboardInput } from './debugger-handler'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    title: 'PepFlash Electron',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
      backgroundThrottling: false,
      offscreen: false,
      plugins: true,
    },
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    mainWindow.setMenu(null)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('minimize', () => {
    mainWindow?.setSkipTaskbar(true)
    mainWindow?.setBounds({
      x: OFFSCREEN_X,
      y: OFFSCREEN_Y,
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
    })
  })

  mainWindow.on('restore', () => {
    mainWindow?.setSkipTaskbar(false)
    mainWindow?.center()
    mainWindow?.focus()
  })
}

function setupIpcHandlers(): void {
  // === Window Background Mode ===
  ipcMain.handle('window:set-background-mode', (_event, enabled: boolean) => {
    if (!mainWindow) return false

    if (enabled) {
      mainWindow.setSkipTaskbar(true)
      mainWindow.setBounds({
        x: OFFSCREEN_X,
        y: OFFSCREEN_Y,
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
      })
    } else {
      mainWindow.setSkipTaskbar(false)
      mainWindow.center()
      mainWindow.focus()
      mainWindow.show()
    }

    return true
  })

  ipcMain.handle('window:is-background-mode', () => {
    if (!mainWindow) return false
    const bounds = mainWindow.getBounds()
    return bounds.x < 0 && bounds.y < 0
  })

  // === File Dialog ===
  ipcMain.handle('dialog:open-swf', async () => {
    if (!mainWindow) return null

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Open Flash File',
      properties: ['openFile'],
      filters: [
        { name: 'Flash Files', extensions: ['swf'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (result.canceled || result.filePaths.length === 0) return null

    const filePath = result.filePaths[0]
    const data = readFileSync(filePath)

    return {
      data: new Uint8Array(data),
      name: basename(filePath),
      path: filePath,
    }
  })

  ipcMain.handle('dialog:read-swf-path', async (_event, filePath: string) => {
    try {
      const data = readFileSync(filePath)
      return {
        data: new Uint8Array(data),
        name: basename(filePath),
        path: filePath,
      }
    } catch {
      return null
    }
  })

  // === Debugger ===
  ipcMain.handle('debugger:attach', () => attachDebugger(mainWindow))

  // === Input ===
  ipcMain.handle('input:send-key', async (_event, key: string) => keyboardInput(key))
  ipcMain.handle(
    'input:send-focus',
    async (_event, elementId: string, insideShadowRootSelector: string | null = null) =>
      focusElement(elementId, insideShadowRootSelector),
  )
  ipcMain.handle(
    'input:send-click',
    async (
      _event,
      elementId: string,
      insideShadowRootSelector: string | null = null,
      position: ClickPosition = 'center',
    ) => clickElement(elementId, insideShadowRootSelector, position),
  )
}

// Pepper Flash (PepFlash) configuration
function setupPepFlash(): void {
  // Try multiple paths to find the plugin
  const possiblePaths = [
    // Development: project root resources folder
    join(process.cwd(), 'resources', 'libpepflashplayer.so'),
    // Production: app resources folder
    join(process.resourcesPath, 'libpepflashplayer.so'),
    // Alternative: app path resources
    join(app.getAppPath(), 'resources', 'libpepflashplayer.so'),
  ]

  // Find the first path that exists
  const fs = require('fs')
  const flashPluginPath = possiblePaths.find((p) => fs.existsSync(p))

  if (!flashPluginPath) {
    console.error('[PepFlash] Plugin not found in any of:', possiblePaths)
    return
  }

  // Register the Pepper Flash plugin
  app.commandLine.appendSwitch('ppapi-flash-path', flashPluginPath)
  app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465')

  // Enable Flash
  app.commandLine.appendSwitch('enable-plugins')
  app.commandLine.appendSwitch('allow-outdated-plugins')

  console.log('[PepFlash] Plugin path:', flashPluginPath)
}

// Core WebGPU activation
// app.commandLine.appendSwitch('enable-unsafe-webgpu')
// app.commandLine.appendSwitch('ignore-gpu-blocklist')
// app.commandLine.appendSwitch('enable-gpu-rasterization')
// app.commandLine.appendSwitch('enable-zero-copy')

// app.commandLine.appendSwitch(
//   'enable-features',
//   'AcceleratedVideoDecodeLinuxGL,AcceleratedVideoDecodeLinuxZeroCopyGL,' +
//     'VaapiVideoDecoder,VaapiVideoEncoder,VaapiOnNvidiaGPUs,' +
//     'AcceleratedVideoEncoder,CanvasOopRasterization,' +
//     'WaylandLinuxDrmSyncobj',
// )

// app.commandLine.appendSwitch('disable-gpu-watchdog')
// app.commandLine.appendSwitch('disable-background-timer-throttling')

// app.disableDomainBlockingFor3DAPIs()
// app.commandLine.appendSwitch('disable-gpu-process-crash-limit')
// app.commandLine.appendSwitch('disable-renderer-backgrounding')
app.disableHardwareAcceleration()

// Setup Pepper Flash before app is ready
setupPepFlash()

app.whenReady().then(() => {
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
