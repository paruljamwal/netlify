import { useNetwork } from '@/context/NetworkContext'

export function ConnectionStatusModal() {
  const { toast, dismissToast } = useNetwork()

  if (!toast) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-sm ${
          toast.online
            ? 'bg-emerald-600/95 text-white'
            : 'bg-[#2f2f2f]/95 text-white ring-1 ring-[#404040]'
        }`}
      >
        <span aria-hidden="true">{toast.online ? '●' : '○'}</span>
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={dismissToast}
          className="ml-1 opacity-70 transition hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
