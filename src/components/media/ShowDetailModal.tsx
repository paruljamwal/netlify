import { useProfile } from '@/context/ProfileContext'
import type { MediaItem } from '@/types/media'
import { POSTER_PLACEHOLDER } from '@/utils/placeholders'

interface ShowDetailModalProps {
  show: MediaItem | null
  onClose: () => void
}

export function ShowDetailModal({ show, onClose }: ShowDetailModalProps) {
  const { isInWatchlist, toggleWatchlist } = useProfile()

  if (!show) return null

  const inList = isInWatchlist(show.id)

  const meta = [
    show.genres.slice(0, 3).join(' · '),
    show.premiered?.slice(0, 4),
    show.runtime ? `${show.runtime} min` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 animate-backdrop-in bg-black/80"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="animate-modal-in relative z-10 grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-xl bg-surface-raised shadow-2xl sm:rounded-lg md:grid-cols-[minmax(200px,36%)_1fr]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="relative hidden min-h-[280px] md:block">
          <img
            src={show.imageUrl ?? POSTER_PLACEHOLDER}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-raised via-transparent to-transparent" />
        </div>

        <div className="flex max-h-[92vh] flex-col overflow-y-auto p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-sm text-white transition hover:bg-black/75"
            aria-label="Close"
          >
            ✕
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Series
          </p>
          <h2 id="detail-title" className="mt-2 pr-10 text-2xl font-bold leading-tight md:text-3xl">
            {show.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {show.rating != null && (
              <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold">
                {show.rating.toFixed(1)} / 10
              </span>
            )}
            {show.status && (
              <span className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-muted">
                {show.status}
              </span>
            )}
          </div>

          {meta && <p className="mt-2 text-sm text-muted">{meta}</p>}

          <img
            src={show.imageUrl ?? POSTER_PLACEHOLDER}
            alt=""
            className="mt-4 aspect-[2/3] w-28 rounded-md object-cover ring-1 ring-surface-border md:hidden"
          />

          {show.summary && (
            <p className="mt-5 text-sm leading-relaxed text-white/90">{show.summary}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={() => toggleWatchlist(show)}
            >
              {inList ? '✓ In My List' : '+ My List'}
            </button>
            <button type="button" className="btn-secondary text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
