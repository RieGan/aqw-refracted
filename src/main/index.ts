import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { WINDOW_HEIGHT, WINDOW_MIN_HEIGHT, WINDOW_MIN_WIDTH, WINDOW_WIDTH } from './constants'
import { setupGpu } from './gpu'
import { setupIpcHandlers } from './ipc-handlers'
import { setupPepFlash } from './pepflash'

let mainWindow: BrowserWindow | null = null

// Ensure single instance
app.requestSingleInstanceLock()

// Command line switches must be set before the 'ready' event is emitted
app.commandLine.appendSwitch('no-sandbox')

// Set up Pepper Flash plugin and GPU settings
setupPepFlash()

// Set up GPU settings to improve performance and compatibility
setupGpu()

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    title: 'AQW Refracted',
    autoHideMenuBar: true,
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
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
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
  app.quit()
})
