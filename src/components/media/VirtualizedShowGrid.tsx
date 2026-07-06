import { memo, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  GRID_COLUMNS,
  GRID_OVERSCAN,
  GRID_ROW_HEIGHT,
} from '@/constants/browse'
import type { MediaItem } from '@/types/media'
import { ShowCard } from './ShowCard'

interface VirtualizedShowGridProps {
  shows: MediaItem[]
  onShowClick?: (show: MediaItem) => void
  isInWatchlist?: (id: string) => boolean
  onToggleWatchlist?: (show: MediaItem) => void
}

const GridRow = memo(function GridRow({
  rowShows,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
}: {
  rowShows: MediaItem[]
  onShowClick?: (show: MediaItem) => void
  isInWatchlist?: (id: string) => boolean
  onToggleWatchlist?: (show: MediaItem) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {rowShows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          variant="portrait"
          onClick={onShowClick}
          inWatchlist={isInWatchlist?.(show.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  )
})

export function VirtualizedShowGrid({
  shows,
  onShowClick,
  isInWatchlist,
  onToggleWatchlist,
}: VirtualizedShowGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowCount = useMemo(
    () => Math.ceil(shows.length / GRID_COLUMNS),
    [shows.length],
  )

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => GRID_ROW_HEIGHT,
    overscan: GRID_OVERSCAN,
  })

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-8rem)] overflow-y-auto px-[clamp(1rem,4vw,3.75rem)]"
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualRows.map((virtualRow) => {
          const start = virtualRow.index * GRID_COLUMNS
          const rowShows = shows.slice(start, start + GRID_COLUMNS)

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 w-full pb-3"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <GridRow
                rowShows={rowShows}
                onShowClick={onShowClick}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
