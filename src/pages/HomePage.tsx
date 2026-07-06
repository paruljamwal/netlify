import { useMemo } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { ContentRow } from '@/components/media/ContentRow'
import { HeroBanner } from '@/components/media/HeroBanner'
import { HOME_SECTIONS } from '@/constants/brand'
import { useShowActions } from '@/hooks/useShowActions'
import { useTrendingShows } from '@/hooks'
import type { MediaItem } from '@/types/media'

function pickTopShow(shows: MediaItem[]): MediaItem | null {
  if (shows.length === 0) return null
  return [...shows].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]
}

function splitRows(shows: MediaItem[], topId: string | undefined) {
  const rest = shows.filter((s) => s.id !== topId)
  const chunk = (arr: MediaItem[], start: number, count: number) =>
    arr.slice(start, start + count)

  return {
    trending: chunk(rest, 0, 12),
    popular: chunk(rest, 12, 12),
    classics: chunk(rest, 24, 12),
  }
}

export function HomePage() {
  const { data, loading, error, isStale, refetch } = useTrendingShows()
  const { handleShowClick, toggleWatchlist, isInWatchlist } = useShowActions()

  const topShow = useMemo(() => (data ? pickTopShow(data) : null), [data])
  const rows = useMemo(
    () =>
      data
        ? splitRows(data, topShow?.id)
        : { trending: [], popular: [], classics: [] },
    [data, topShow?.id],
  )

  return (
    <PageLayout showFooter={false}>
      <main>
        <HeroBanner
          show={topShow}
          loading={loading}
          onPlay={handleShowClick}
          onMoreInfo={handleShowClick}
        />

        {error && !data && (
          <div className="flex flex-col items-center gap-4 px-page-x py-16 text-center text-muted">
            <p className="max-w-md">{error.userMessage}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded bg-surface-elevated px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-subtle"
            >
              Try again
            </button>
          </div>
        )}

        {isStale && (
          <p className="bg-brand/10 px-page-x py-2.5 text-center text-sm text-muted">
            Showing saved data — you may be offline.
          </p>
        )}

        <div className="relative z-[2] pt-20 pb-8">
          <ContentRow
            title={HOME_SECTIONS.trending}
            shows={rows.trending}
            variant="landscape"
            loading={loading}
            onShowClick={handleShowClick}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={toggleWatchlist}
          />
          <ContentRow
            title={HOME_SECTIONS.popular}
            shows={rows.popular}
            variant="portrait"
            loading={loading}
            onShowClick={handleShowClick}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={toggleWatchlist}
          />
          <ContentRow
            title={HOME_SECTIONS.classics}
            shows={rows.classics}
            variant="landscape"
            loading={loading}
            onShowClick={handleShowClick}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        </div>
      </main>
    </PageLayout>
  )
}
