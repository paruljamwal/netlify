import { Skeleton } from '@/components/common/Skeleton'
import type { ShowCardLayout, ShowCardVariant } from './ShowCard'

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
  layout?: ShowCardLayout
}

export function ShowCardSkeleton({
  variant = 'landscape',
  layout = 'row',
}: ShowCardSkeletonProps) {
  const widthClass = layout === 'grid' ? 'w-full min-w-0' : variantWidth[variant]

  return (
    <div className={`${layout === 'row' ? 'shrink-0' : ''} ${widthClass}`} aria-hidden="true">
      <div className={`overflow-hidden rounded-sm ${variantAspect[variant]} bg-surface-raised`}>
        <Skeleton />
      </div>
    </div>
  )
}
