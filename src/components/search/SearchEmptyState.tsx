import type { SearchMode } from '@/utils/search'

interface SearchEmptyStateProps {
  mode: SearchMode
  query: string
  hasSearched: boolean
  loading: boolean
}

const PLACEHOLDER_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect fill="#2f2f2f" width="120" height="120" rx="8"/><text x="50%" y="52%" fill="#808080" font-size="32" text-anchor="middle">⌕</text></svg>',
  )

export function SearchEmptyState({
  mode,
  query,
  hasSearched,
  loading,
}: SearchEmptyStateProps) {
  if (loading) return null

  if (mode === 'idle' || !hasSearched) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <img src={PLACEHOLDER_IMG} alt="" className="mb-6 h-24 w-24 opacity-60" />
        <h2 className="text-xl font-semibold">Search TV shows</h2>
        <p className="mt-2 max-w-md text-sm text-[#b3b3b3]">
          Try a show name, ID (e.g. 169), or release year (e.g. 2008)
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <img src={PLACEHOLDER_IMG} alt="" className="mb-6 h-24 w-24 opacity-40" />
      <h2 className="text-xl font-semibold">No results for &ldquo;{query}&rdquo;</h2>
      <p className="mt-2 max-w-md text-sm text-[#b3b3b3]">
        {mode === 'id' && 'No show found with that ID.'}
        {mode === 'year' && 'No shows found for that year. Try another year.'}
        {mode === 'name' && 'Check the spelling or try a different title.'}
      </p>
    </div>
  )
}
