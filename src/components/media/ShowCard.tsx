import { memo, useEffect, useState } from 'react'
import type { MediaItem } from '@/types/media'
import { POSTER_PLACEHOLDER } from '@/utils/placeholders'

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
  const [imgSrc, setImgSrc] = useState(show.imageUrl ?? POSTER_PLACEHOLDER)
  const hoverClass = layout === 'grid' ? 'card-hover-grid' : 'card-hover'
  const aspectClass = layout === 'grid' ? 'aspect-[2/3]' : variantAspect[variant]

  useEffect(() => {
    setImgSrc(show.imageUrl ?? POSTER_PLACEHOLDER)
  }, [show.id, show.imageUrl])

  return (
    <article
      className={`group ${hoverClass} relative cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white hover:z-10 ${layout === 'grid' ? 'grid-card w-full min-w-0' : `shrink-0 snap-start ${variantWidth[variant]}`}`}
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
      <div className={`relative w-full overflow-hidden rounded-sm bg-surface-raised ${aspectClass}`}>
        {onToggleWatchlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleWatchlist(show)
            }}
            className={`absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 ${
              inWatchlist
                ? 'bg-brand text-white opacity-100'
                : 'bg-black/70 text-white hover:bg-black/90'
            }`}
            aria-label={inWatchlist ? 'Remove from My List' : 'Add to My List'}
          >
            {inWatchlist ? '✓' : '+'}
          </button>
        )}

        {show.rating != null && (
          <span className="absolute bottom-1.5 left-1.5 z-10 rounded-sm bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {show.rating.toFixed(1)}
          </span>
        )}

        <img
          src={imgSrc}
          alt={show.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
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
