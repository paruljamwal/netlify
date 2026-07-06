import { useEffect, useRef, useState } from 'react'
import { MIN_NAME_SEARCH_LENGTH } from '@/constants/search'
import { SearchIcon } from '@/components/common/SearchIcon'
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions'
import type { MediaItem } from '@/types/media'
import { detectSearchMode } from '@/utils/search'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  onSelectSuggestion?: (item: MediaItem) => void
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onSelectSuggestion,
  autoFocus = false,
}: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { suggestions, loadingSuggestions } = useSearchSuggestions(value)

  const showSuggestions =
    open &&
    detectSearchMode(value) === 'name' &&
    value.trim().length >= MIN_NAME_SEARCH_LENGTH &&
    (suggestions.length > 0 || loadingSuggestions)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    onSubmit?.(value)
  }

  const handleSelect = (item: MediaItem) => {
    onChange(item.title)
    setOpen(false)
    onSelectSuggestion?.(item)
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          autoFocus={autoFocus}
          placeholder="Titles, people, genres"
          className="w-full rounded-md bg-surface-elevated py-3.5 pl-12 pr-12 text-white placeholder-subtle outline-none ring-1 ring-surface-border transition focus:ring-2 focus:ring-brand"
          aria-label="Search shows"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          role="combobox"
        />
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        >
          <SearchIcon size={20} />
        </span>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-sm text-muted transition hover:bg-surface-border hover:text-white"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>

      {showSuggestions && (
        <ul
          className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-md bg-surface-elevated py-1 shadow-2xl ring-1 ring-surface-border"
          role="listbox"
        >
          {loadingSuggestions && suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">Loading…</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-surface-border"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-11 w-8 shrink-0 rounded object-cover ring-1 ring-surface-border"
                    />
                  ) : (
                    <div className="flex h-11 w-8 shrink-0 items-center justify-center rounded bg-surface-border text-xs text-subtle">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted">
                      {item.premiered?.slice(0, 4) ?? 'Unknown year'}
                      {item.rating != null && ` · ${item.rating.toFixed(1)} ★`}
                    </p>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
