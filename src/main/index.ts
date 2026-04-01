import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import {
  OFFSCREEN_X,
  OFFSCREEN_Y,
  WINDOW_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  WINDOW_WIDTH,
} from './constants'
import { setupGpu } from './gpu'
import { setupIpcHandlers } from './ipc-handlers'
import { setupPepFlash } from './pepflash'

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
      nativeWindowOpen: true,
    },
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    mainWindow.setMenu(null)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
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

app.whenReady().then(() => {
  setupIpcHandlers(() => mainWindow)
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

//
app.requestSingleInstanceLock()
app.commandLine.appendSwitch('no-sandbox')
setupPepFlash()
setupGpu()
