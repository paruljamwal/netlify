import { mediaService } from './mediaService'

type RefreshListener = () => void

const listeners = new Set<RefreshListener>()

export function onReconnect(listener: RefreshListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifyReconnect(): void {
  listeners.forEach((listener) => listener())
}

// prefetch home data so offline has something to show
export async function warmOfflineCache(): Promise<void> {
  if (!navigator.onLine) return

  try {
    await mediaService.browseShows({ forceRefresh: true })
  } catch {
    // best effort
  }
}
