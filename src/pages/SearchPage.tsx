import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { SearchResults } from '@/components/search/SearchResults'
import { useMediaSearch } from '@/hooks/useMediaSearch'
import { useShowActions } from '@/hooks/useShowActions'
import type { MediaItem } from '@/types/media'

const hints = [
  { label: 'By name', example: 'Breaking Bad' },
  { label: 'By ID', example: 'tt0903747' },
  { label: 'By year', example: '2011' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const { results, loading, error, mode, debouncedQuery, hasSearched, isStale } =
    useMediaSearch({ query })
  const { handleShowClick, toggleWatchlist, isInWatchlist } = useShowActions()

  useEffect(() => {
    const param = searchParams.get('q') ?? ''
    if (param !== query) setQuery(param)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const current = searchParams.get('q') ?? ''
    if (trimmed && trimmed !== current) {
      setSearchParams({ q: trimmed }, { replace: true })
    }
    if (!trimmed && current) {
      setSearchParams({}, { replace: true })
    }
  }, [debouncedQuery, searchParams, setSearchParams])

  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (trimmed) setSearchParams({ q: trimmed }, { replace: true })
      else setSearchParams({}, { replace: true })
    },
    [setSearchParams],
  )

  const handleSelectSuggestion = useCallback(
    (item: MediaItem) => {
      setQuery(item.id)
      setSearchParams({ q: item.id }, { replace: true })
    },
    [setSearchParams],
  )

  const showResults = loading || results.length > 0

  return (
    <PageLayout navbar="solid">
      <main className="mx-auto max-w-content px-page-x pt-24 pb-12">
        <header className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Find something to watch
          </p>
          <h1 className="mt-2 text-3xl font-bold">Search</h1>
          <p className="mt-2 text-sm text-muted">
            Look up titles by name, IMDb ID, or release year.
          </p>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          onSelectSuggestion={handleSelectSuggestion}
          autoFocus
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {hints.map(({ label, example }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setQuery(example)
                setSearchParams({ q: example }, { replace: true })
              }}
              className="rounded-full bg-surface-elevated px-3 py-1.5 text-xs text-muted ring-1 ring-surface-border transition hover:bg-surface-border hover:text-white"
            >
              {label}: <span className="text-white">{example}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-md border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-white">
            {error.userMessage}
          </div>
        )}

        {isStale && (
          <p className="mt-4 rounded-md bg-surface-elevated px-4 py-2 text-center text-sm text-muted">
            Offline — showing saved results
          </p>
        )}

        <div className="mt-10">
          {showResults ? (
            <SearchResults
              results={results}
              loading={loading}
              mode={mode}
              onShowClick={handleShowClick}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          ) : (
            <SearchEmptyState
              mode={mode}
              query={debouncedQuery}
              hasSearched={hasSearched}
              loading={loading}
            />
          )}
        </div>
      </main>
    </PageLayout>
  )
}
