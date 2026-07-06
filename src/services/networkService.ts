export function isBrowserOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

type NetworkListener = (online: boolean) => void

export function subscribeToNetwork(listener: NetworkListener): () => void {
  const onOnline = () => listener(true)
  const onOffline = () => listener(false)

  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
