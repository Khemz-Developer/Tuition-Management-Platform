import * as React from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

export interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  id?: string
  className?: string
  triggerClassName?: string
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  id,
  className,
  triggerClassName,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [highlightIndex, setHighlightIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter((opt) => opt.toLowerCase().includes(q))
  }, [options, search])

  const select = React.useCallback(
    (option: string) => {
      onValueChange(option)
      setSearch('')
      setHighlightIndex(0)
      setOpen(false)
    },
    [onValueChange]
  )

  React.useEffect(() => {
    if (!open) return
    setSearch('')
    setHighlightIndex(0)
    const t = requestAnimationFrame(() => searchInputRef.current?.focus())
    return () => cancelAnimationFrame(t)
  }, [open])

  React.useEffect(() => {
    setHighlightIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)))
  }, [filtered.length])

  React.useEffect(() => {
    if (!open) return
    const el = listRef.current
    const highlighted = el?.querySelector('[data-highlighted="true"]')
    highlighted?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex, open])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filtered[highlightIndex]) select(filtered[highlightIndex])
        break
      case 'Escape':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-activedescendant={open && filtered[highlightIndex] ? `${id}-option-${highlightIndex}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left',
          triggerClassName
        )}
      >
        <span className={cn(!value && 'text-muted-foreground')}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 opacity-50 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute z-50 mt-1 w-full min-w-[var(--radix-select-trigger-width)] rounded-md border bg-popover text-popover-foreground shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          <div className="p-2 border-b bg-muted/30">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="flex h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <ScrollArea className="h-60">
            <div ref={listRef} className="p-1">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filtered.map((option, index) => (
                  <div
                    key={option}
                    id={id ? `${id}-option-${index}` : undefined}
                    role="option"
                    aria-selected={value === option}
                    data-highlighted={index === highlightIndex}
                    onClick={() => select(option)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors',
                      index === highlightIndex && 'bg-accent text-accent-foreground',
                      value === option && 'font-medium'
                    )}
                  >
                    {value === option ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    {option}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
