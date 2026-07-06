export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`block h-full w-full animate-shimmer rounded ${className}`}
      aria-hidden="true"
    />
  )
}
