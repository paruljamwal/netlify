import { memo } from 'react'
import type { MediaItem } from '@/types/media'
import { ShowCard, type ShowCardVariant } from './ShowCard'
import { ShowCardSkeleton } from './ShowCardSkeleton'

interface ContentRowProps {
  title: string
  shows: MediaItem[]
  variant?: ShowCardVariant
  loading?: boolean
  skeletonCount?: number
  onShowClick?: (show: MediaItem) => void
  isInWatchlist?: (id: string) => boolean
  onToggleWatchlist?: (show: MediaItem) => void
}

function ContentRowComponent({
  title,
  shows,
  variant = 'landscape',
  loading = false,
  skeletonCount = 8,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
}: ContentRowProps) {
  return (
    <section
      className="mb-12 pl-[clamp(1rem,4vw,3.75rem)]"
      aria-busy={loading}
    >
      <h2 className="mb-4 text-xl font-semibold tracking-wide">{title}</h2>
      <div className="flex snap-x snap-proximity gap-2 overflow-x-auto pb-4 pr-[clamp(1rem,4vw,3.75rem)] md:gap-4">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <ShowCardSkeleton key={i} variant={variant} />
            ))
          : shows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                variant={variant}
                onClick={onShowClick}
                inWatchlist={isInWatchlist?.(show.id)}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
      </div>
    </section>
  )
}

export const ContentRow = memo(ContentRowComponent)
