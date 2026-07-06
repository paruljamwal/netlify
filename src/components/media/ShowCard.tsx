import { memo, useEffect, useState } from 'react'
import { WatchlistButton } from '@/components/common/WatchlistButton'
import type { MediaItem } from '@/types/media'
import { POSTER_PLACEHOLDER } from '@/utils/placeholders'
import { toOriginalImageUrl } from '@/utils/imageUrl'

export type ShowCardVariant = 'landscape' | 'portrait'
export type ShowCardLayout = 'row' | 'grid'

interface ShowCardProps {
  show: MediaItem
  variant?: ShowCardVariant
  layout?: ShowCardLayout
  onClick?: (show: MediaItem) => void
  inWatchlist?: boolean
  onToggleWatchlist?: (show: MediaItem) => void
}

const variantWidth: Record<ShowCardVariant, string> = {
  landscape: 'w-[clamp(200px,18vw,280px)]',
  portrait: 'w-[clamp(120px,10vw,160px)]',
}

const variantAspect: Record<ShowCardVariant, string> = {
  landscape: 'aspect-video',
  portrait: 'aspect-[2/3]',
}

function ShowCardComponent({
  show,
  variant = 'landscape',
  layout = 'row',
  onClick,
  inWatchlist = false,
  onToggleWatchlist,
}: ShowCardProps) {
  const [imgSrc, setImgSrc] = useState(
    () => toOriginalImageUrl(show.imageUrl) ?? POSTER_PLACEHOLDER,
  )
  const posterHover = layout === 'grid' ? 'poster-hover-grid' : 'poster-hover'
  const aspectClass = layout === 'grid' ? 'aspect-[2/3]' : variantAspect[variant]

  useEffect(() => {
    setImgSrc(toOriginalImageUrl(show.imageUrl) ?? POSTER_PLACEHOLDER)
  }, [show.id, show.imageUrl])

  return (
    <article
      className={`group relative cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white hover:z-20 ${layout === 'grid' ? 'grid-card w-full min-w-0' : `shrink-0 snap-start ${variantWidth[variant]}`}`}
      onClick={() => onClick?.(show)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick(show)
        }
      }}
    >
      <div className="absolute right-2 top-2 z-30">
        {onToggleWatchlist && (
          <WatchlistButton
            inWatchlist={inWatchlist}
            onToggle={() => onToggleWatchlist(show)}
          />
        )}
      </div>

      <div
        className={`${posterHover} relative w-full overflow-hidden rounded-sm bg-surface-raised shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${aspectClass}`}
      >
        {show.rating != null && (
          <span className="absolute bottom-1.5 left-1.5 z-10 rounded-sm bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {show.rating.toFixed(1)}
          </span>
        )}

        <img
          src={imgSrc}
          alt={show.title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(POSTER_PLACEHOLDER)}
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <h3 className="m-0 line-clamp-2 text-xs font-semibold leading-tight md:text-sm">
            {show.title}
          </h3>
        </div>
      </div>
    </article>
  )
}

export const ShowCard = memo(ShowCardComponent, (prev, next) => {
  return (
    prev.show.id === next.show.id &&
    prev.variant === next.variant &&
    prev.layout === next.layout &&
    prev.onClick === next.onClick &&
    prev.inWatchlist === next.inWatchlist &&
    prev.onToggleWatchlist === next.onToggleWatchlist
  )
})
