import { Button } from '@/components/ui/button'

export function OtherToolsPanel() {
  return (
    <div className="flex flex-col gap-2.5 p-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">Tools</h3>
        <p className="text-xs text-muted-foreground/80">No custom tools active</p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled
        className="mt-2 h-8 text-xs bg-muted/30"
        onClick={() => {
          // Future: window.api.sendTcpPacket(connectionId, data)
        }}
      >
        Sample Command
      </Button>
    </div>
  )
}
