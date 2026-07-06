import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  enabled?: boolean
  rootMargin?: string
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  { enabled = true, rootMargin = '400px' }: UseInfiniteScrollOptions = {},
) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  useEffect(() => {
    if (!enabled) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current()
        }
      },
      { rootMargin },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [enabled, rootMargin])

  return sentinelRef
}
