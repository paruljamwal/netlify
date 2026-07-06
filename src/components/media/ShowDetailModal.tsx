import type { MediaItem } from '@/types/media'

interface ShowDetailModalProps {
  show: MediaItem | null
  onClose: () => void
}

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect fill="#2f2f2f" width="400" height="600"/></svg>',
  )

export function ShowDetailModal({ show, onClose }: ShowDetailModalProps) {
  if (!show) return null

  const meta = [
    show.genres.slice(0, 3).join(' · '),
    show.premiered?.slice(0, 4),
    show.runtime ? `${show.runtime} min` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 animate-backdrop-in bg-black/75"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="animate-modal-in relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-[#181818] shadow-2xl md:grid-cols-[220px_1fr]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="hidden md:block">
          <img
            src={show.imageUrl ?? PLACEHOLDER}
            alt=""
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>

        <div className="flex max-h-[90vh] flex-col overflow-y-auto p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-sm text-white transition hover:bg-black/70"
            aria-label="Close"
          >
            ✕
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#e50914]">
            Details
          </p>
          <h2 id="detail-title" className="mt-2 text-2xl font-bold leading-tight">
            {show.title}
          </h2>
          {meta && <p className="mt-2 text-sm text-[#b3b3b3]">{meta}</p>}
          {show.rating != null && (
            <p className="mt-1 text-sm text-[#b3b3b3]">{show.rating.toFixed(1)} / 10</p>
          )}

          <img
            src={show.imageUrl ?? PLACEHOLDER}
            alt=""
            className="mt-4 aspect-[2/3] w-32 rounded object-cover md:hidden"
          />

          {show.summary && (
            <p className="mt-5 text-sm leading-relaxed text-[#e5e5e5]">{show.summary}</p>
          )}

          {show.status && (
            <p className="mt-4 text-xs text-[#808080]">Status: {show.status}</p>
          )}
        </div>
      </div>
    </div>
  )
}
