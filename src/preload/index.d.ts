export type ClickPosition = 'left' | 'center' | 'right' | 'top' | 'bottom'

export interface ElectronAPI {
  openSwfFile(): Promise<{ data: Uint8Array; name: string; path: string } | null>
  readSwfFile(filePath: string): Promise<{ data: Uint8Array; name: string; path: string } | null>
  attachDebugger(): Promise<boolean>
  sendKeyPress(key: string): Promise<boolean>
  sendFocus(elementId: string, insideShadowRootSelector?: string | null): Promise<boolean>
  sendClick(
    elementId: string,
    insideShadowRootSelector?: string | null,
    position?: ClickPosition,
  ): Promise<boolean>
  setBackgroundMode(enabled: boolean): Promise<boolean>
  isBackgroundMode(): Promise<boolean>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
