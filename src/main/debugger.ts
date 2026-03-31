import type { BrowserWindow } from 'electron'

let debuggerAttached = false
let debuggerClient: Electron.Debugger | null = null

export function attachDebugger(mainWindow: BrowserWindow | null) {
  if (!mainWindow || debuggerAttached) return debuggerAttached

  try {
    mainWindow.webContents.debugger.attach('1.3')
    debuggerAttached = true
    console.log('Debugger attached')

    mainWindow.webContents.debugger.on('detach', () => {
      console.log('Debugger detached')
      debuggerAttached = false
    })

    debuggerClient = mainWindow.webContents.debugger

    return true
  } catch (err) {
    console.error('Failed to attach debugger:', err)
    return false
  }
}

export const isDebuggerAttached = () => debuggerAttached

export const getDebugger = () => debuggerClient
