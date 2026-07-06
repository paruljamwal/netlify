import { useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { ContentRow } from '@/components/media/ContentRow'
import { HeroBanner } from '@/components/media/HeroBanner'
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
  const { data, loading, error, isStale, refetch } = useTrendingShows(0)

  const topShow = useMemo(() => (data ? pickTopShow(data) : null), [data])
  const rows = useMemo(
    () =>
      data
        ? splitRows(data, topShow?.id)
        : { trending: [], popular: [], classics: [] },
    [data, topShow?.id],
  )

  return (
    <div className="min-h-screen bg-[#141414] font-sans text-white antialiased">
      <Navbar />
      <main>
        <HeroBanner show={topShow} loading={loading} />

        {error && !data && (
          <div className="flex flex-col items-center gap-4 px-[clamp(1rem,4vw,3.75rem)] py-12 text-center text-[#b3b3b3]">
            <p>{error.userMessage}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded bg-[#2f2f2f] px-6 py-2 text-white transition hover:bg-[#808080]"
            >
              Try again
            </button>
          </div>
        )}

        {isStale && (
          <p className="bg-[#e50914]/15 px-[clamp(1rem,4vw,3.75rem)] py-2 text-center text-sm text-[#b3b3b3]">
            Showing cached data — you may be offline.
          </p>
        )}

        <div className="relative z-[2] pt-8 pb-12">
          <ContentRow
            title="Trending Now"
            shows={rows.trending}
            variant="landscape"
            loading={loading}
          />
          <ContentRow
            title="Popular on Netflix"
            shows={rows.popular}
            variant="portrait"
            loading={loading}
          />
          <ContentRow
            title="TV Classics"
            shows={rows.classics}
            variant="landscape"
            loading={loading}
          />
        </div>
      </main>
    </div>
  )
}
