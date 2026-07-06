import { useEffect } from 'react'
import { onReconnect } from '@/services/offlineService'

export function useOfflineRefresh(callback: () => void) {
  useEffect(() => {
    return onReconnect(callback)
  }, [callback])
}
