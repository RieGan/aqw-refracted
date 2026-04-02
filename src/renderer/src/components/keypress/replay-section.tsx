import { Play, Square } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { useKeyReplayContext } from '@/hooks/use-key-replay'
import type { KeyReplayEntry } from '@/lib/key-recordings'
import { cn } from '@/lib/utils'

function formatDelay(ms: number): string {
  if (ms <= 0) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

interface ReplaySectionProps {
  selectedRecord: { name: string; entries: KeyReplayEntry[] } | null
  replay: ReturnType<typeof useKeyReplayContext>
  disabled?: boolean
}

export function ReplaySection({ selectedRecord, replay, disabled }: ReplaySectionProps) {
  const [loopEnabled, setLoopEnabled] = useState(false)
  const activeKeyRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this when currentIndex or isReplaying changes, not on every render
  useEffect(() => {
    if (replay.isReplaying && activeKeyRef.current) {
      activeKeyRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [replay.currentIndex])

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to include replay in the dependencies, as it's a stable object that won't change between renders
  const handlePlay = useCallback(() => {
    if (!selectedRecord) return
    replay.start(selectedRecord.entries, loopEnabled)
  }, [selectedRecord, loopEnabled])

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 px-1">
        <Play
          className={cn(
            'size-4',
            replay.isReplaying ? 'text-green-400 fill-green-400' : 'text-muted-foreground',
          )}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Replay
        </span>
        {replay.isReplaying && (
          <span className="ml-auto text-[11px] font-medium text-green-400 uppercase tracking-wide">
            Playing{loopEnabled ? ' (loop)' : ''}...
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3.5 rounded-xl bg-muted/30 p-3.5">
        {!selectedRecord ? (
          <p className="text-xs text-muted-foreground/70 text-center py-3">
            Select a recording below to replay
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground truncate">
                {selectedRecord.name}
              </span>
              <span className="text-[11px] text-muted-foreground/70 shrink-0 ml-2">
                {selectedRecord.entries.length} keys
              </span>
            </div>

            <div className="flex flex-col gap-px max-h-40 overflow-y-auto rounded-lg bg-background/50 p-1.5">
              {selectedRecord.entries.map((entry, index) => (
                <div
                  key={`${entry.key}-${entry.nextDelay}`}
                  ref={
                    index === replay.currentIndex && replay.isReplaying ? activeKeyRef : undefined
                  }
                  className={cn(
                    'flex items-center gap-2.5 px-1.5 py-0.5 rounded text-xs transition-colors',
                    index === replay.currentIndex && replay.isReplaying
                      ? 'bg-primary/20 text-primary'
                      : index < replay.currentIndex && replay.isReplaying
                        ? 'opacity-50'
                        : '',
                  )}
                >
                  <span
                    className={cn(
                      'size-5 flex items-center justify-center rounded font-mono text-xs font-bold shrink-0',
                      index === replay.currentIndex && replay.isReplaying
                        ? 'bg-primary/25'
                        : 'bg-muted/50',
                    )}
                  >
                    {entry.key}
                  </span>

                  {/* <span className="text-muted-foreground/40">→</span> */}
                  <span className="text-muted-foreground text-[11px]">
                    {formatDelay(entry.nextDelay)}
                  </span>
                  {index === replay.currentIndex && replay.isReplaying && (
                    <span className="size-1 rounded-full bg-primary shrink-0 animate-pulse" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-auto">
                <Switch
                  size="sm"
                  checked={loopEnabled}
                  onCheckedChange={setLoopEnabled}
                  disabled={replay.isReplaying}
                />
                <Label className="text-[11px] text-muted-foreground select-none">Loop</Label>
              </div>

              {!replay.isReplaying ? (
                <Button size="xs" className="text-xs" disabled={disabled} onClick={handlePlay}>
                  <Play className="size-3.5" />
                  Play
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="destructive"
                  className="text-xs"
                  onClick={() => replay.stop()}
                >
                  <Square className="size-3 fill-current" />
                  Stop
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
