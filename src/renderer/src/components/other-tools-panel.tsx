import { Button } from '@/components/ui/button'

export function OtherToolsPanel() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[11px] font-semibold tracking-wide text-foreground/80 uppercase">
          Tools
        </h3>
        <p className="text-[10px] text-muted-foreground/60">No custom tools active</p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled
        className="mt-2 h-7 text-[10px] bg-muted/20"
        onClick={() => {
          // Future: window.api.sendTcpPacket(connectionId, data)
        }}
      >
        Sample Command
      </Button>
    </div>
  )
}
