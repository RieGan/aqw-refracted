/* biome-ignore-all lint/a11y/useSemanticElements: needs div with nested buttons */

import {
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { SavedKeyRecord } from '@/lib/key-recordings'
import { cn } from '@/lib/utils'

interface SavedRecordingsListProps {
  records: SavedKeyRecord[]
  selectedRecordId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onReorder: (fromIndex: number, direction: 'up' | 'down') => void
  disabled?: boolean
}

export function SavedRecordingsList({
  records,
  selectedRecordId,
  onSelect,
  onRename,
  onDelete,
  onReorder,
  disabled,
}: SavedRecordingsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleRename = (id: string) => {
    const record = records.find((r) => r.id === id)
    if (!record) return
    setEditingId(id)
    setEditingName(record.name)
  }

  const handleConfirmRename = () => {
    if (!editingId) return
    const name = editingName.trim()
    if (name) {
      onRename(editingId, name)
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 px-1">
        <Archive className="size-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Saved Recordings
        </span>
        {records.length > 0 && (
          <span className="ml-auto text-[9px] text-muted-foreground/40">{records.length}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 rounded-xl bg-muted/20 p-2">
        {records.length === 0 ? (
          <p className="text-[10px] text-muted-foreground/50 text-center py-3">
            No saved recordings yet
          </p>
        ) : (
          records.map((record, index) => (
            <div
              key={record.id}
              data-disabled={disabled || undefined}
              className={cn(
                'group flex items-center gap-1 rounded-lg p-1.5 transition-colors cursor-pointer text-left w-full data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
                selectedRecordId === record.id
                  ? 'bg-primary/10 ring-1 ring-primary/20'
                  : 'hover:bg-muted/30',
              )}
              onClick={() => editingId !== record.id && !disabled && onSelect(record.id)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabled && editingId !== record.id) {
                  e.preventDefault()
                  onSelect(record.id)
                }
              }}
            >
              <div className="flex flex-col -my-0.5 shrink-0">
                <button
                  type="button"
                  className="p-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors disabled:opacity-0"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onReorder(index, 'up')
                  }}
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  type="button"
                  className="p-0 text-muted-foreground/30 hover:text-muted-foreground transition-colors disabled:opacity-0"
                  disabled={index === records.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    onReorder(index, 'down')
                  }}
                >
                  <ChevronDown className="size-3" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {editingId === record.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      className="h-5 text-[10px] bg-background/50 px-1.5 flex-1"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key === 'Enter') handleConfirmRename()
                        if (e.key === 'Escape') handleCancelRename()
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="p-0.5 text-green-400 hover:text-green-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConfirmRename()
                      }}
                    >
                      <Check className="size-3" />
                    </button>
                    <button
                      type="button"
                      className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancelRename()
                      }}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium truncate">{record.name}</span>
                    <span className="text-[9px] text-muted-foreground/40">
                      {record.entries.length} keys
                    </span>
                  </div>
                )}
              </div>

              {editingId !== record.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-0.5 shrink-0 text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[120px]">
                    <DropdownMenuItem
                      className="text-xs gap-2"
                      onClick={() => handleRename(record.id)}
                    >
                      <Pencil className="size-3" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs gap-2 text-destructive focus:text-destructive"
                      onClick={() => onDelete(record.id)}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
