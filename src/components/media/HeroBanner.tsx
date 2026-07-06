import { Skeleton } from '@/components/common/Skeleton'
import type { MediaItem } from '@/types/media'
import { BACKDROP_PLACEHOLDER } from '@/utils/placeholders'
import { toOriginalImageUrl } from '@/utils/imageUrl'

interface HeroBannerProps {
  show: MediaItem | null
  loading?: boolean
  onPlay?: (show: MediaItem) => void
  onMoreInfo?: (show: MediaItem) => void
}

function truncate(text: string | null, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

const heroShell =
  'relative h-[clamp(440px,78vh,720px)] min-h-[440px] overflow-hidden -mb-16'

const heroContent =
  'relative z-10 mx-auto flex h-full max-w-content flex-col justify-end px-page-x pb-16 pt-28'

export function HeroBanner({
  show,
  loading = false,
  onPlay,
  onMoreInfo,
}: HeroBannerProps) {
  if (loading || !show) {
    return <HeroSkeleton />
  }

  const backdropUrl =
    toOriginalImageUrl(show.imageUrl) ?? BACKDROP_PLACEHOLDER

  return (
    <section className={heroShell} aria-label="Today's Top Show">
      <img
        src={backdropUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-surface-base from-0% via-surface-base/55 via-40% to-transparent to-70%"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-base to-transparent"
        aria-hidden="true"
      />

      <div className={heroContent}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-brand/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            #1 Today
          </span>
          {show.rating != null && (
            <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {show.rating.toFixed(1)} ★
            </span>
          )}
          {show.premiered && (
            <span className="text-xs text-muted">{show.premiered.slice(0, 4)}</span>
          )}
        </div>

        <h1 className="mb-3 max-w-[14ch] text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] drop-shadow-lg">
          {show.title}
        </h1>

        {show.genres.length > 0 && (
          <p className="mb-4 text-sm text-muted">
            {show.genres.slice(0, 4).join(' · ')}
          </p>
        )}

        <p className="mb-7 line-clamp-3 max-w-xl text-base leading-relaxed text-white/90 drop-shadow max-md:hidden">
          {truncate(show.summary, 240)}
        </p>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => onPlay?.(show)}>
            <span aria-hidden="true">▶</span> Play
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onMoreInfo?.(show)}
          >
            <span aria-hidden="true">ℹ</span> More Info
          </button>
        </div>
      </div>
    </section>
  )
}

function HeroSkeleton() {
  return (
    <section
      className={heroShell}
      aria-busy="true"
      aria-label="Loading featured show"
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-surface-base/95 via-surface-base/60 to-transparent"
        aria-hidden="true"
      />
      <div className={heroContent}>
        <Skeleton className="mb-3 h-5 w-28" />
        <Skeleton className="mb-3 h-14 w-[min(520px,75%)]" />
        <Skeleton className="mb-4 h-4 w-48" />
        <Skeleton className="mb-7 h-[72px] w-[min(540px,90%)] max-md:hidden" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-[130px]" />
          <Skeleton className="h-11 w-[150px]" />
        </div>
      </div>
    </section>
  )
}
