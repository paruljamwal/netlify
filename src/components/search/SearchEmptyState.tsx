import { SearchIcon } from '@/components/common/SearchIcon'
import type { SearchMode } from '@/utils/search'

interface SearchEmptyStateProps {
  mode: SearchMode
  query: string
  hasSearched: boolean
  loading: boolean
}

export function SearchEmptyState({
  mode,
  query,
  hasSearched,
  loading,
}: SearchEmptyStateProps) {
  if (loading) return null

  if (mode === 'idle' || !hasSearched) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed border-surface-border bg-surface-raised/40 px-6 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-muted">
          <SearchIcon size={28} />
        </div>
        <h2 className="text-xl font-semibold">Start searching</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Try a show name like &ldquo;Sherlock&rdquo;, an ID like &ldquo;335&rdquo;, or a
          year like &ldquo;2016&rdquo;.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-surface-border bg-surface-raised/40 px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-2xl text-subtle">
        ?
      </div>
      <h2 className="text-xl font-semibold">No results for &ldquo;{query}&rdquo;</h2>
      <p className="mt-2 max-w-md text-sm text-muted">
        {mode === 'id' && 'No show exists with that ID.'}
        {mode === 'year' && 'Nothing matched that year in the catalog we scanned.'}
        {mode === 'name' && 'Try a different spelling or a shorter keyword.'}
      </p>
    </div>
  )
}
