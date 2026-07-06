import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { MediaItem } from '@/types/media'
import { ShowDetailModal } from '@/components/media/ShowDetailModal'

interface DetailModalContextValue {
  openDetail: (show: MediaItem) => void
  closeDetail: () => void
}

const DetailModalContext = createContext<DetailModalContextValue | null>(null)

export function DetailModalProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState<MediaItem | null>(null)

  const openDetail = useCallback((item: MediaItem) => setShow(item), [])
  const closeDetail = useCallback(() => setShow(null), [])

  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [show, closeDetail])

  return (
    <DetailModalContext.Provider value={{ openDetail, closeDetail }}>
      {children}
      <ShowDetailModal show={show} onClose={closeDetail} />
    </DetailModalContext.Provider>
  )
}

export function useDetailModal() {
  const ctx = useContext(DetailModalContext)
  if (!ctx) throw new Error('useDetailModal must be used within DetailModalProvider')
  return ctx
}
