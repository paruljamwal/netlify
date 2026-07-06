import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { OFFLINE_TOAST_MS } from '@/constants/network'
import { isBrowserOnline, subscribeToNetwork } from '@/services/networkService'
import { notifyReconnect, warmOfflineCache } from '@/services/offlineService'

type ConnectionToast = {
  online: boolean
  message: string
}

interface NetworkContextValue {
  isOnline: boolean
  toast: ConnectionToast | null
  dismissToast: () => void
}

const NetworkContext = createContext<NetworkContextValue | null>(null)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(isBrowserOnline)
  const [toast, setToast] = useState<ConnectionToast | null>(null)
  const wasOfflineRef = useRef(!isBrowserOnline())

  const showToast = useCallback((online: boolean) => {
    setToast({
      online,
      message: online ? "You're back online" : "You're offline — showing saved content",
    })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    void warmOfflineCache()
  }, [])

  useEffect(() => {
    return subscribeToNetwork((online) => {
      setIsOnline(online)

      if (online && wasOfflineRef.current) {
        wasOfflineRef.current = false
        showToast(true)
        notifyReconnect()
        void warmOfflineCache()
      }

      if (!online) {
        wasOfflineRef.current = true
        showToast(false)
      }
    })
  }, [showToast])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), OFFLINE_TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <NetworkContext.Provider value={{ isOnline, toast, dismissToast }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const ctx = useContext(NetworkContext)
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider')
  return ctx
}
