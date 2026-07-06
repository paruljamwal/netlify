import { memo } from 'react'
import type { MediaItem } from '@/types/media'

export type ShowCardVariant = 'landscape' | 'portrait'

interface ShowCardProps {
  show: MediaItem
  variant?: ShowCardVariant
  onClick?: (show: MediaItem) => void
}

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect fill="#2f2f2f" width="300" height="450"/><text x="50%" y="50%" fill="#808080" font-size="14" text-anchor="middle" dy=".3em">No image</text></svg>',
  )

const variantWidth: Record<ShowCardVariant, string> = {
  landscape: 'w-[clamp(200px,18vw,280px)]',
  portrait: 'w-[clamp(120px,10vw,160px)] lg:w-full',
}

const variantAspect: Record<ShowCardVariant, string> = {
  landscape: 'aspect-video',
  portrait: 'aspect-[2/3]',
}

function ShowCardComponent({
  show,
  variant = 'landscape',
  onClick,
}: ShowCardProps) {
  return (
    <article
      className={`group shrink-0 cursor-pointer rounded transition-all duration-300 ease-out hover:z-10 hover:scale-[1.08] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${variantWidth[variant]}`}
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
      <div
        className={`relative overflow-hidden rounded bg-[#181818] ${variantAspect[variant]}`}
      >
        <img
          src={show.imageUrl ?? PLACEHOLDER}
          alt={show.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-3">
          <h3
            className={`m-0 line-clamp-2 font-semibold leading-tight ${variant === 'portrait' ? 'text-xs' : 'text-sm'}`}
          >
            {show.title}
          </h3>
          {show.rating != null && (
            <span className="mt-1 text-xs text-[#b3b3b3]">
              {show.rating.toFixed(1)} ★
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export const ShowCard = memo(ShowCardComponent, (prev, next) => {
  return (
    prev.show.id === next.show.id &&
    prev.variant === next.variant &&
    prev.onClick === next.onClick
  )
})
