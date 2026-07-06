import { Skeleton } from '@/components/common/Skeleton'
import type { MediaItem } from '@/types/media'

interface HeroBannerProps {
  show: MediaItem | null
  loading?: boolean
}

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect fill="#181818" width="1920" height="1080"/></svg>',
  )

function truncate(text: string | null, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

const heroShell =
  'relative h-[clamp(420px,75vh,680px)] min-h-[420px] overflow-hidden -mb-8'

const heroContent =
  'relative z-10 mx-auto flex h-full max-w-[1920px] flex-col justify-end px-[clamp(1rem,4vw,3.75rem)] pb-12 pt-24'

export function HeroBanner({ show, loading = false }: HeroBannerProps) {
  if (loading || !show) {
    return <HeroSkeleton />
  }

  const meta = [show.genres.slice(0, 3).join(' · '), show.premiered?.slice(0, 4)]
    .filter(Boolean)
    .join(' · ')

  const backdropUrl =
    show.imageUrl?.replace('/medium/', '/original/') ?? PLACEHOLDER

  return (
    <section className={heroShell} aria-label="Today's Top Show">
      <img
        src={backdropUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 from-0% via-[#141414]/60 via-35% to-transparent to-55%"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#141414] to-transparent"
        aria-hidden="true"
      />
      <div className={heroContent}>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e50914]">
          Today&apos;s Top Show
        </p>
        <h1 className="mb-2 max-w-[12ch] text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight drop-shadow-lg">
          {show.title}
        </h1>
        {meta && <p className="mb-4 text-sm text-[#b3b3b3]">{meta}</p>}
        <p className="mb-6 line-clamp-3 max-w-xl text-base leading-relaxed drop-shadow max-md:hidden">
          {truncate(show.summary, 220)}
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="rounded bg-white px-7 py-2.5 text-base font-semibold text-[#141414] transition hover:scale-105 hover:bg-white/85"
          >
            ▶ Play
          </button>
          <button
            type="button"
            className="rounded bg-[#6d6d6e]/70 px-7 py-2.5 text-base font-semibold text-white transition hover:scale-105 hover:bg-[#6d6d6e]/50"
          >
            ℹ More Info
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
        className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#141414]/60 to-transparent"
        aria-hidden="true"
      />
      <div className={heroContent}>
        <Skeleton className="mb-2 h-3.5 w-[140px]" />
        <Skeleton className="mb-2 h-12 w-[min(480px,70%)]" />
        <Skeleton className="mb-4 h-3.5 w-[200px]" />
        <Skeleton className="mb-6 h-[60px] w-[min(520px,85%)] max-md:hidden" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-11 w-[120px]" />
          <Skeleton className="h-11 w-[140px]" />
        </div>
      </div>
    </section>
  )
}
