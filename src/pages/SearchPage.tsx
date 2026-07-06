import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { SearchResults } from '@/components/search/SearchResults'
import { useMediaSearch } from '@/hooks/useMediaSearch'
import type { MediaItem } from '@/types/media'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const { results, loading, error, mode, debouncedQuery, hasSearched } =
    useMediaSearch({ query })

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
  }, [debouncedQuery, searchParams, setSearchParams]) // sync ?q= in url

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
      setQuery(item.title)
      setSearchParams({ q: item.title }, { replace: true })
    },
    [setSearchParams],
  )

  const showResults = loading || results.length > 0

  return (
    <div className="min-h-screen bg-[#141414] font-sans text-white antialiased">
      <Navbar />
      <main className="px-[clamp(1rem,4vw,3.75rem)] pt-24 pb-12">
        <h1 className="mb-6 text-2xl font-bold">Search</h1>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          onSelectSuggestion={handleSelectSuggestion}
          autoFocus
        />

        <p className="mt-3 text-xs text-[#808080]">
          Name · numeric ID · 4-digit year (e.g. 2011)
        </p>

        {error && (
          <div className="mt-6 rounded bg-[#e50914]/10 px-4 py-3 text-sm text-[#e50914]">
            {error.userMessage}
          </div>
        )}

        <div className="mt-8">
          {showResults ? (
            <SearchResults results={results} loading={loading} mode={mode} />
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
    </div>
  )
}
