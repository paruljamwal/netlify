import { memo, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { ShowCardSkeleton } from '@/components/media/ShowCardSkeleton'
import { VirtualizedShowGrid } from '@/components/media/VirtualizedShowGrid'
import { MAX_BROWSE_SHOWS } from '@/constants/browse'
import { useInfiniteScroll, useInfiniteShows } from '@/hooks'
import { useShowActions } from '@/hooks/useShowActions'

export function BrowsePage() {
  const { shows, loading, hasMore, error, loadMore } =
    useInfiniteShows(MAX_BROWSE_SHOWS)
  const { handleShowClick, toggleWatchlist, isInWatchlist } = useShowActions()

  const handleLoadMore = useCallback(() => {
    void loadMore()
  }, [loadMore])

  const sentinelRef = useInfiniteScroll(handleLoadMore, {
    enabled: hasMore && !loading,
  })

  return (
    <div className="min-h-screen bg-[#141414] font-sans text-white antialiased">
      <Navbar />
      <header className="px-[clamp(1rem,4vw,3.75rem)] pt-20 pb-4">
        <h1 className="text-2xl font-bold">All TV Shows</h1>
        <p className="mt-1 text-sm text-[#b3b3b3]">
          {shows.length.toLocaleString()} loaded
          {hasMore ? ' — scroll for more' : ' — end of catalog'}
        </p>
        {error && (
          <p className="mt-2 text-sm text-[#e50914]">{error.userMessage}</p>
        )}
      </header>

      {shows.length > 0 ? (
        <VirtualizedShowGrid
          shows={shows}
          onShowClick={handleShowClick}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3 px-[clamp(1rem,4vw,3.75rem)] sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShowCardSkeleton key={i} variant="portrait" />
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {loading && shows.length > 0 && (
        <p className="py-4 text-center text-sm text-[#b3b3b3]">
          Loading more shows…
        </p>
      )}
    </div>
  )
}

export default memo(BrowsePage)
