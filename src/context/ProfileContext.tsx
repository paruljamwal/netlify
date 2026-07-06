import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import type { HistoryEntry, UserSession } from '@/types/profile'
import type { MediaItem } from '@/types/media'
import {
  clearSession,
  clearSignedOutFlag,
  getDefaultUser,
  isSignedOut,
  loadHistory,
  loadSession,
  loadWatchlist,
  saveHistory,
  saveSession,
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
  signIn: () => void
  signOut: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserSession | null>(() => loadSession())
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => loadWatchlist())
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  useEffect(() => {
    const session = loadSession()
    if (session) {
      setUser(session)
      return
    }
    if (!isSignedOut()) {
      const defaultUser = getDefaultUser()
      setUser(defaultUser)
      saveSession(defaultUser)
    }
  }, [])

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

  const signIn = useCallback(() => {
    clearSignedOutFlag()
    const defaultUser = getDefaultUser()
    setUser(defaultUser)
    saveSession(defaultUser)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
    navigate(ROUTES.HOME)
  }, [navigate])

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
      signIn,
      signOut,
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
      signIn,
      signOut,
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
