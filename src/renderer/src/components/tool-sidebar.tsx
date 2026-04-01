import { Keyboard, Wrench, X } from 'lucide-react'
import { AutoKeyPressPanel } from '@/components/auto-keypress-panel'
import { OtherToolsPanel } from '@/components/other-tools-panel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ToolSidebarProps {
  onClose: () => void
}

export function ToolSidebar({ onClose }: ToolSidebarProps) {
  return (
    <div className="flex w-72 flex-col overflow-hidden border-l border-border/10 bg-background/95 backdrop-blur-xl shadow-2xl">
      <Tabs defaultValue="keypress" className="flex h-full flex-col">
        <div className="flex flex-col p-2 z-10">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-[11px] font-semibold text-foreground/70 tracking-widest uppercase">
              Tools
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 rounded-full opacity-50 hover:opacity-100"
              onClick={onClose}
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <TabsList className="grid grid-cols-2 h-8 bg-muted/20 p-0.5 rounded-lg space-x-2">
            <TabsTrigger
              value="keypress"
              className="gap-1.5 text-[10px] font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md shadow-none data-[state=active]:shadow-sm"
            >
              <Keyboard className="size-3" />
              <span>Keys</span>
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="gap-1.5 text-[10px] font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md shadow-none data-[state=active]:shadow-sm"
            >
              <Wrench className="size-3" />
              <span>Tools</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="keypress" className="flex-1 m-0 overflow-y-auto p-2">
          <AutoKeyPressPanel />
        </TabsContent>
        <TabsContent value="tools" className="flex-1 m-0 overflow-y-auto p-2">
          <OtherToolsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
