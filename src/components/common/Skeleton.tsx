interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`block h-full w-full animate-pulse rounded bg-[#2f2f2f] ${className}`}
      aria-hidden="true"
    />
  )
}
