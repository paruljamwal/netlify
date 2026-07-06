import { useEffect, useRef, useState } from 'react'
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
    value.trim().length >= 2 &&
    (suggestions.length > 0 || loadingSuggestions)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []) // close dropdown on blur

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
          placeholder="Search by name, ID, or year…"
          className="w-full rounded bg-[#2f2f2f]/90 py-3 pl-11 pr-4 text-white placeholder-[#808080] outline-none ring-[#e50914] transition focus:ring-2"
          aria-label="Search shows"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          role="combobox"
        />
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#b3b3b3]"
          aria-hidden="true"
        >
          ⌕
        </span>
      </form>

      {showSuggestions && (
        <ul
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded bg-[#2f2f2f] py-1 shadow-lg"
          role="listbox"
        >
          {loadingSuggestions && suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#b3b3b3]">Loading…</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#404040]"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-10 w-7 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-7 shrink-0 items-center justify-center rounded bg-[#404040] text-xs text-[#808080]">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[#b3b3b3]">
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
