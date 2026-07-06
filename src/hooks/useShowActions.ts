import { useCallback } from 'react'
import { useDetailModal } from '@/context/DetailModalContext'
import { useProfile } from '@/context/ProfileContext'
import type { MediaItem } from '@/types/media'

export function useShowActions() {
  const { recordWatch, toggleWatchlist, isInWatchlist } = useProfile()
  const { openDetail } = useDetailModal()

  const handleShowClick = useCallback(
    (show: MediaItem) => {
      recordWatch(show)
      openDetail(show)
    },
    [recordWatch, openDetail],
  )

  return { handleShowClick, toggleWatchlist, isInWatchlist }
}
