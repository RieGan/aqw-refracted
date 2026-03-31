import { Circle, Save, Square, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useKeyRecorder } from '@/hooks/use-key-recorder'
import { addSavedKeyRecord, type KeyPressEntry, type KeyReplayEntry } from '@/lib/key-recordings'
import { cn } from '@/lib/utils'

function formatDelay(ms: number): string {
  if (ms <= 0) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function computeDelays(entries: KeyPressEntry[]): { key: string; delay: number; ts: number }[] {
  return entries.map(({ key, timestamp }, i) => ({
    key,
    delay: i === entries.length - 1 ? 0 : entries[i + 1].timestamp - timestamp,
    ts: timestamp,
  }))
}

interface RecordingSectionProps {
  onSave: () => void
  onRecordingStart?: () => void
  onRecordingStop?: () => void
  disabled?: boolean
  recordCount: number
}

export function RecordingSection({
  onSave,
  onRecordingStart,
  onRecordingStop,
  disabled,
  recordCount,
}: RecordingSectionProps) {
  const recorder = useKeyRecorder()
  const [saveName, setSaveName] = useState('')
  const recordingListRef = useRef<HTMLDivElement>(null)
  const recordedReplayEntriesRef = useRef<KeyReplayEntry[]>([])

  const recordedDelays = useMemo(() => computeDelays(recorder.keyPresses), [recorder.keyPresses])

  useEffect(() => {
    if (recorder.state === 'recording' && recordingListRef.current) {
      recordingListRef.current.scrollTop = recordingListRef.current.scrollHeight
    }
  }, [recorder.keyPresses, recorder.state])

  const isRecording = recorder.state !== 'idle'
  const hasPendingRecording = recorder.state === 'idle' && recorder.keyPresses.length > 0

  const handleStartRecording = useCallback(() => {
    recorder.start()
    onRecordingStart?.()
  }, [recorder, onRecordingStart])

  const handleStopRecording = useCallback(() => {
    recorder.stop((replayEntries) => {
      recordedReplayEntriesRef.current = replayEntries
    })
    onRecordingStop?.()
  }, [recorder, onRecordingStop])

  const handleSave = useCallback(() => {
    if (recordedReplayEntriesRef.current.length === 0) return
    const name = saveName.trim() || `Recording ${recordCount + 1}`
    addSavedKeyRecord(name, recordedReplayEntriesRef.current)
    setSaveName('')
    recorder.clear()
    onSave()
  }, [recordCount, saveName, recorder, onSave])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 px-1">
        <Circle
          className={cn(
            'size-3.5',
            recorder.state === 'recording'
              ? 'fill-red-500 text-red-500 animate-pulse'
              : recorder.state === 'waiting'
                ? 'fill-amber-500 text-amber-500'
                : 'text-muted-foreground',
          )}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Recording
        </span>
        {recorder.state !== 'idle' && (
          <span
            className={cn(
              'ml-auto text-[9px] font-medium uppercase tracking-wide',
              recorder.state === 'recording' ? 'text-red-400' : 'text-amber-400',
            )}
          >
            {recorder.state === 'recording' ? 'Recording...' : 'Waiting for input...'}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl bg-muted/20 p-3">
        <div className="flex gap-1.5">
          <Button
            size="xs"
            variant={isRecording ? 'outline' : 'default'}
            className="flex-1 text-[10px]"
            disabled={isRecording || disabled}
            onClick={handleStartRecording}
          >
            <Circle className="size-2.5 fill-current" />
            Record
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="flex-1 text-[10px]"
            disabled={!isRecording}
            onClick={handleStopRecording}
          >
            <Square className="size-2.5 fill-current" />
            Stop
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="text-[10px] px-2"
            disabled={recorder.keyPresses.length === 0 && !isRecording}
            onClick={() => recorder.clear()}
          >
            <X className="size-3" />
          </Button>
        </div>

        {recorder.state === 'waiting' && (
          <p className="text-[10px] text-muted-foreground/50 text-center py-1">
            Press a key (1-6) to begin...
          </p>
        )}

        {recorder.keyPresses.length > 0 && (
          <div
            ref={recordingListRef}
            className="flex flex-col gap-px max-h-28 overflow-y-auto rounded-lg bg-background/30 p-1.5"
          >
            {recordedDelays.map((entry) => (
              <div
                key={entry.ts}
                className="flex items-center gap-2 px-1.5 py-0.5 rounded text-[10px]"
              >
                <span className="size-4 flex items-center justify-center rounded bg-muted/40 font-mono text-[10px] font-bold">
                  {entry.key}
                </span>
                <span className="text-muted-foreground/40">→</span>
                <span className="text-muted-foreground text-[9px]">{formatDelay(entry.delay)}</span>
              </div>
            ))}
          </div>
        )}

        {hasPendingRecording && (
          <div className="flex flex-col gap-1.5 border-t border-border/30 pt-2">
            <Input
              className="h-6 text-[10px] bg-background/50 px-2"
              placeholder={`Recording ${recordCount + 1}`}
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button size="xs" className="text-[10px] w-full" onClick={handleSave}>
              <Save className="size-3" />
              Save Recording
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
