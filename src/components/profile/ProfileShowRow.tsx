import { ShowCard } from '@/components/media/ShowCard'
import type { MediaItem } from '@/types/media'

interface ProfileShowRowProps {
  shows: MediaItem[]
  onRemove?: (id: string) => void
  onSelect?: (show: MediaItem) => void
}

export function ProfileShowRow({ shows, onRemove, onSelect }: ProfileShowRowProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {shows.map((show) => (
        <div key={show.id} className="relative shrink-0">
          <ShowCard
            show={show}
            variant="portrait"
            onClick={onSelect ? () => onSelect(show) : undefined}
          />
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(show.id)}
              className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white transition hover:bg-[#e50914]"
              aria-label={`Remove ${show.title}`}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
