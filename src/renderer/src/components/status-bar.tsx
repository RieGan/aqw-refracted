import { Gauge, Play, Repeat } from 'lucide-react'
import { useFps } from '@/hooks/use-fps'
import { useKeyReplayContext } from '@/hooks/use-key-replay'

export function StatusBar() {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between gap-4 border-t border-border/10 bg-background/90 backdrop-blur-md px-4 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-4">
        <FpsStatus />
      </div>
      <div className="flex items-center gap-4">
        <KeyReplayStatus />
      </div>
    </div>
  )
}

const FpsStatus = () => {
  const { fps } = useFps(true)

  return (
    <div className="flex items-center gap-1.5 opacity-80">
      <Gauge className="size-3" />
      <span className="font-mono">{fps} FPS</span>
    </div>
  )
}

const KeyReplayStatus = () => {
  const { isReplaying, isLooping } = useKeyReplayContext()

  if (!isReplaying) return null

  return (
    <div
      className={`flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 ${
        isLooping ? 'text-status-loop' : 'text-status-success'
      }`}
    >
      {isLooping ? <Repeat className="size-3" /> : <Play className="size-3" />}
      <span className="font-medium uppercase tracking-wider text-[9px]">
        {isLooping ? 'Looping' : 'Playing'}
      </span>
    </div>
  )
}
