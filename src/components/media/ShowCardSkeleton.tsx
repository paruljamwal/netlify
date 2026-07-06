import { Skeleton } from '@/components/common/Skeleton'
import type { ShowCardVariant } from './ShowCard'

const variantWidth: Record<ShowCardVariant, string> = {
  landscape: 'w-[clamp(200px,18vw,280px)]',
  portrait: 'w-[clamp(120px,10vw,160px)]',
}

const variantAspect: Record<ShowCardVariant, string> = {
  landscape: 'aspect-video',
  portrait: 'aspect-[2/3]',
}

interface ShowCardSkeletonProps {
  variant?: ShowCardVariant
}

export function ShowCardSkeleton({ variant = 'landscape' }: ShowCardSkeletonProps) {
  return (
    <div className={`shrink-0 ${variantWidth[variant]}`} aria-hidden="true">
      <div className={`overflow-hidden rounded ${variantAspect[variant]} bg-[#181818]`}>
        <Skeleton />
      </div>
    </div>
  )
}
