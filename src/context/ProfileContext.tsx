import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toUserSession } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import type { HistoryEntry, UserSession } from '@/types/profile'
import type { MediaItem } from '@/types/media'
import {
  loadHistory,
  loadWatchlist,
  saveHistory,
  saveWatchlist,
  trimHistory,
} from '@/utils/profileStorage'

interface ProfileContextValue {
  user: UserSession | null
  watchlist: MediaItem[]
  history: HistoryEntry[]
  isInWatchlist: (id: string) => boolean
  addToWatchlist: (show: MediaItem) => void
  removeFromWatchlist: (id: string) => void
  toggleWatchlist: (show: MediaItem) => void
  recordWatch: (show: MediaItem) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth()
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => loadWatchlist())
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  const user = useMemo(
    () => (authUser ? toUserSession(authUser) : null),
    [authUser],
  )

  useEffect(() => {
    saveWatchlist(watchlist)
  }, [watchlist])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((s) => s.id === id),
    [watchlist],
  )

  const addToWatchlist = useCallback((show: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.some((s) => s.id === show.id)) return prev
      return [...prev, show]
    })
  }, [])

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const toggleWatchlist = useCallback((show: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.some((s) => s.id === show.id)) {
        return prev.filter((s) => s.id !== show.id)
      }
      return [...prev, show]
    })
  }, [])

  const recordWatch = useCallback((show: MediaItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((e) => e.show.id !== show.id)
      const entry: HistoryEntry = { show, watchedAt: new Date().toISOString() }
      return trimHistory([entry, ...filtered])
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      watchlist,
      history,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      recordWatch,
    }),
    [
      user,
      watchlist,
      history,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      recordWatch,
    ],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
