import { KEY_RECORDINGS_STORAGE_KEY } from './constants'

export interface KeyReplayEntry {
  key: string
  nextDelay: number
}

export type RecorderStatus = 'idle' | 'waiting' | 'recording'

export interface KeyPressEntry {
  key: string
  timestamp: number
}

export interface SavedKeyRecord {
  id: string
  name: string
  entries: KeyReplayEntry[]
  timestamp: number
}

let savedKeyRecords: SavedKeyRecord[] | undefined

export function loadSavedKeyRecords(): SavedKeyRecord[] {
  if (savedKeyRecords) return savedKeyRecords

  try {
    const stored = localStorage.getItem(KEY_RECORDINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed) {
        savedKeyRecords = parsed as SavedKeyRecord[]
        return savedKeyRecords
      }
    }
  } catch (error) {
    console.error('Failed to load key recordings from localStorage', error)
  }

  savedKeyRecords = []
  return savedKeyRecords
}

export function addSavedKeyRecord(name: string, entries: KeyReplayEntry[]): void {
  const record: SavedKeyRecord = {
    id: Date.now().toString(),
    name,
    entries,
    timestamp: Date.now(),
  }

  if (savedKeyRecords) savedKeyRecords.push(record)
  else savedKeyRecords = [record]

  localStorage.setItem(KEY_RECORDINGS_STORAGE_KEY, JSON.stringify(savedKeyRecords))
}

export function renameSavedKeyRecord(id: string, name: string): void {
  const record = savedKeyRecords?.find((r) => r.id === id)
  if (record) {
    record.name = name
    localStorage.setItem(KEY_RECORDINGS_STORAGE_KEY, JSON.stringify(savedKeyRecords))
  }
}

export function deleteSavedKeyRecord(id: string): void {
  if (savedKeyRecords) {
    savedKeyRecords = savedKeyRecords.filter((r) => r.id !== id)
    localStorage.setItem(KEY_RECORDINGS_STORAGE_KEY, JSON.stringify(savedKeyRecords))
  }
}

export function clearKeyRecordings(): void {
  localStorage.removeItem(KEY_RECORDINGS_STORAGE_KEY)
  savedKeyRecords = []
}

export function toKeyReplayEntries(entries: KeyPressEntry[]): KeyReplayEntry[] {
  if (entries.length === 0) return []

  const keyPressesCount = entries.length

  return entries.map(({ key, timestamp }, i) => {
    const nextDelay = i === keyPressesCount - 1 ? 0 : entries[i + 1].timestamp - timestamp
    const jitter = Math.random()
    return { key, nextDelay: nextDelay + jitter }
  })
}
