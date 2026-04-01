/** biome-ignore-all lint/style/useNodejsImportProtocol: we need to use node.js import protocol for fs */

import { type BrowserWindow, dialog, ipcMain } from 'electron'
import { readFileSync } from 'fs'
import { basename } from 'path'
import { OFFSCREEN_X, OFFSCREEN_Y, WINDOW_HEIGHT, WINDOW_WIDTH } from './constants'
import { attachDebugger } from './debugger'
import { type ClickPosition, clickElement, focusElement, keyboardInput } from './debugger-handler'

export function setupIpcHandlers(getMainWindow: () => BrowserWindow | null): void {
  ipcMain.handle('window:set-background-mode', (_event, enabled: boolean) => {
    const mainWindow = getMainWindow()
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
    const mainWindow = getMainWindow()
    if (!mainWindow) return false
    const bounds = mainWindow.getBounds()
    return bounds.x < 0 && bounds.y < 0
  })

  ipcMain.handle('dialog:open-swf', async () => {
    const mainWindow = getMainWindow()
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

  ipcMain.handle('debugger:attach', () => {
    const mainWindow = getMainWindow()
    return attachDebugger(mainWindow)
  })

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
