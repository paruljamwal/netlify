import { memo, useCallback } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { ShowCardSkeleton } from '@/components/media/ShowCardSkeleton'
import { VirtualizedShowGrid } from '@/components/media/VirtualizedShowGrid'
import { MAX_BROWSE_SHOWS } from '@/constants/browse'
import { useInfiniteScroll, useInfiniteShows } from '@/hooks'
import { useShowActions } from '@/hooks/useShowActions'
import type { MediaItem } from '@/types/media'

type BrowseGridProps = Readonly<{
  shows: MediaItem[]
  loading: boolean
  error: { userMessage: string } | null
  onRetry: () => void
  onShowClick: (show: MediaItem) => void
  isInWatchlist: (id: string) => boolean
  onToggleWatchlist: (show: MediaItem) => void
}>

function BrowseGrid({
  shows,
  loading,
  error,
  onRetry,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
}: BrowseGridProps) {
  if (shows.length > 0) {
    return (
      <VirtualizedShowGrid
        shows={shows}
        onShowClick={onShowClick}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={onToggleWatchlist}
        loading={loading}
      />
    )
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-content grid-cols-2 gap-x-2 gap-y-5 px-page-x sm:grid-cols-3 md:grid-cols-4 md:gap-x-2.5 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <ShowCardSkeleton key={`browse-skel-${i}`} variant="portrait" layout="grid" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 px-page-x py-16 text-center text-muted">
        <p className="max-w-md">{error.userMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-surface-elevated px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-subtle"
        >
          Try again
        </button>
      </div>
    )
  }

  return null
}

export function BrowsePage() {
  const { shows, loading, hasMore, error, loadMore, retry } =
    useInfiniteShows(MAX_BROWSE_SHOWS)
  const { handleShowClick, toggleWatchlist, isInWatchlist } = useShowActions()

  const handleLoadMore = useCallback(() => {
    void loadMore()
  }, [loadMore])

  const handleRetry = useCallback(() => {
    void retry()
  }, [retry])

  const sentinelRef = useInfiniteScroll(handleLoadMore, {
    enabled: hasMore && !loading && !error,
    rootMargin: '600px',
  })

  return (
    <PageLayout showFooter={false} navbar="solid">
      <header className="mx-auto max-w-content px-page-x pt-24 pb-5">
        <h1 className="text-2xl font-bold md:text-3xl">TV Shows</h1>
        {error && shows.length > 0 && (
          <p className="mt-3 rounded-sm border border-brand/30 bg-brand/10 px-4 py-2 text-sm">
            {error.userMessage}
          </p>
        )}
      </header>

      <BrowseGrid
        shows={shows}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onShowClick={handleShowClick}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={toggleWatchlist}
      />

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
