import { useCallback, useMemo, useState } from 'react'
import { useKeyReplayContext } from '@/hooks/use-key-replay'
import { KEY_RECORDINGS_STORAGE_KEY } from '@/lib/constants'
import {
  deleteSavedKeyRecord,
  loadSavedKeyRecords,
  renameSavedKeyRecord,
  type SavedKeyRecord,
} from '@/lib/key-recordings'
import { RecordingSection } from './keypress/recording-section'
import { ReplaySection } from './keypress/replay-section'
import { SavedRecordingsList } from './keypress/saved-recordings-list'

export function AutoKeyPressPanel() {
  const replay = useKeyReplayContext()
  const [records, setRecords] = useState<SavedKeyRecord[]>(() => [...loadSavedKeyRecords()])
  const [replayDisabled, setReplayDisabled] = useState(false)

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === replay.keyReferenceId) ?? null,
    [records, replay.keyReferenceId],
  )

  const refreshRecords = useCallback(() => {
    setRecords([...loadSavedKeyRecords()])
  }, [])

  const handleSelectRecord = (id: string) => {
    if (replay.isReplaying) replay.stop()
    replay.setKeyReferenceId(id === replay.keyReferenceId ? null : id)
  }

  const handleRename = (id: string, name: string) => {
    renameSavedKeyRecord(id, name)
    refreshRecords()
  }

  const handleDelete = (id: string) => {
    deleteSavedKeyRecord(id)
    if (replay.keyReferenceId === id) {
      replay.setKeyReferenceId(null)
      if (replay.isReplaying) replay.stop()
    }
    refreshRecords()
  }

  const handleReorder = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= records.length) return

    const cached = loadSavedKeyRecords()
    const [item] = cached.splice(fromIndex, 1)
    cached.splice(toIndex, 0, item)
    localStorage.setItem(KEY_RECORDINGS_STORAGE_KEY, JSON.stringify(cached))
    refreshRecords()
  }

  return (
    <div className="flex flex-col gap-3">
      <RecordingSection
        onSave={refreshRecords}
        disabled={replay.isReplaying}
        recordCount={records.length}
        onRecordingStart={() => setReplayDisabled(true)}
        onRecordingStop={() => setReplayDisabled(false)}
      />

      <ReplaySection selectedRecord={selectedRecord} replay={replay} disabled={replayDisabled} />

      <SavedRecordingsList
        records={records}
        selectedRecordId={replay.keyReferenceId}
        onSelect={handleSelectRecord}
        onRename={handleRename}
        onDelete={handleDelete}
        onReorder={handleReorder}
        disabled={replayDisabled || replay.isReplaying}
      />
    </div>
  )
}
