import { contextBridge, ipcRenderer } from 'electron'
import type { ClickPosition } from './index.d'

const api = {
  openSwfFile: (): Promise<{ data: Uint8Array; name: string; path: string } | null> =>
    ipcRenderer.invoke('dialog:open-swf'),
  readSwfFile: (
    filePath: string,
  ): Promise<{ data: Uint8Array; name: string; path: string } | null> =>
    ipcRenderer.invoke('dialog:read-swf-path', filePath),
  attachDebugger: (): Promise<boolean> => ipcRenderer.invoke('debugger:attach'),
  sendKeyPress: (key: string): Promise<boolean> => ipcRenderer.invoke('input:send-key', key),
  sendFocus: (
    elementId: string,
    insideShadowRootSelector: string | null = null,
  ): Promise<boolean> =>
    ipcRenderer.invoke('input:send-focus', elementId, insideShadowRootSelector),
  sendClick: (
    elementId: string,
    insideShadowRootSelector: string | null = null,
    position: ClickPosition = 'center',
  ): Promise<boolean> =>
    ipcRenderer.invoke('input:send-click', elementId, insideShadowRootSelector, position),
  setBackgroundMode: (enabled: boolean): Promise<boolean> =>
    ipcRenderer.invoke('window:set-background-mode', enabled),
  isBackgroundMode: (): Promise<boolean> => ipcRenderer.invoke('window:is-background-mode'),
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
