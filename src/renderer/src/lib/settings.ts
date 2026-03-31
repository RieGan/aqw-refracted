export const SETTINGS_STORAGE_KEY = 'pepflash-settings'
export const DEFAULT_SWF_URL = ''

export type SwfSourceType = 'url' | 'file'

export interface SwfSettings {
  sourceType: SwfSourceType
  url: string
  filePath: string | null
  fileName: string | null
}

export interface AppSettings {
  swf: SwfSettings
}

export const DEFAULT_SETTINGS: AppSettings = {
  swf: {
    sourceType: 'url',
    url: DEFAULT_SWF_URL,
    filePath: null,
    fileName: null,
  },
}

let settings: AppSettings | undefined

export function loadSettings(): AppSettings {
  if (settings) return settings

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      settings = {
        swf: { ...DEFAULT_SETTINGS.swf, ...parsed.swf },
      }
      return settings
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage', error)
  }

  settings = DEFAULT_SETTINGS
  return settings
}

export function saveSettings(newSettings: AppSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
  settings = newSettings
}
