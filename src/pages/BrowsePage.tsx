import { memo, useCallback } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
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
    rootMargin: '600px',
  })

  return (
    <PageLayout showFooter={false} navbar="solid">
      <header className="mx-auto max-w-content px-page-x pt-24 pb-5">
        <h1 className="text-2xl font-bold md:text-3xl">TV Shows</h1>
        {error && (
          <p className="mt-3 rounded-sm border border-brand/30 bg-brand/10 px-4 py-2 text-sm">
            {error.userMessage}
          </p>
        )}
      </header>

      {shows.length > 0 ? (
        <VirtualizedShowGrid
          shows={shows}
          onShowClick={handleShowClick}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={toggleWatchlist}
          loading={loading}
        />
      ) : loading ? (
        <div className="mx-auto grid max-w-content grid-cols-2 gap-x-2 gap-y-5 px-page-x sm:grid-cols-3 md:grid-cols-4 md:gap-x-2.5 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShowCardSkeleton key={i} variant="portrait" layout="grid" />
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {!loading && !hasMore && shows.length > 0 && (
        <p className="pb-16 text-center text-xs text-subtle">
          That&apos;s everything for now
        </p>
      )}
    </PageLayout>
  )
}

export default memo(BrowsePage)
