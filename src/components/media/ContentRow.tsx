import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

function ScrollButton({
  direction,
  onClick,
  visible,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  visible: boolean
}) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 text-2xl text-white opacity-0 transition hover:bg-black/70 group-hover/row:opacity-100 md:flex ${direction === 'left' ? 'left-0' : 'right-0'}`}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    updateScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      el.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [updateScroll, loading, shows.length])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -520 : 520,
      behavior: 'smooth',
    })
  }

  return (
    <section className="group/row mb-10 px-page-x" aria-busy={loading}>
      <h2 className="section-title mb-3">{title}</h2>

      <div className="relative">
        <ScrollButton direction="left" onClick={() => scroll('left')} visible={canLeft} />
        <ScrollButton direction="right" onClick={() => scroll('right')} visible={canRight} />

        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 md:gap-2.5"
        >
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
      </div>
    </section>
  )
}

export const ContentRow = memo(ContentRowComponent)
