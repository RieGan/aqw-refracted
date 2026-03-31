import { PanelRightOpen } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { StatusBar } from '@/components/status-bar'
import { ToolSidebar } from '@/components/tool-sidebar'
import { Button } from './ui/button'

export function PlayerContainer({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex flex-col h-full z-10">
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 relative bg-black/20">
          {children}
          {!sidebarOpen && (
            <div className="absolute top-2 right-2 z-50">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="rounded-full shadow-sm border border-border/40 bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all duration-300 hover:scale-105 active:scale-95 size-8"
              >
                <PanelRightOpen className="size-4" />
              </Button>
            </div>
          )}
        </div>
        {sidebarOpen && <ToolSidebar onClose={() => setSidebarOpen(false)} />}
      </div>
      <StatusBar />
    </div>
  )
}
