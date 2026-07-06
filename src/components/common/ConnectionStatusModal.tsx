import { useNetwork } from '@/context/NetworkContext'

export function ConnectionStatusModal() {
  const { toast, dismissToast } = useNetwork()

  if (!toast) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[200] w-[min(90vw,24rem)] -translate-x-1/2 animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md ${
          toast.online
            ? 'bg-emerald-700/95 text-white'
            : 'bg-surface-elevated/95 text-white ring-1 ring-surface-border'
        }`}
      >
        <span
          className={`flex h-2 w-2 shrink-0 rounded-full ${toast.online ? 'bg-white' : 'bg-brand'}`}
          aria-hidden="true"
        />
        <span className="flex-1">{toast.message}</span>
        <button
          type="button"
          onClick={dismissToast}
          className="shrink-0 rounded p-1 opacity-70 transition hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
