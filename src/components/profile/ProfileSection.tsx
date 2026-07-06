import type { ReactNode } from 'react'

interface ProfileSectionProps {
  title: string
  children: ReactNode
  emptyMessage?: string
  isEmpty?: boolean
  action?: ReactNode
}

export function ProfileSection({
  title,
  children,
  emptyMessage,
  isEmpty = false,
  action,
}: ProfileSectionProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action}
      </div>

      {isEmpty ? (
        <div className="rounded border border-dashed border-[#404040] bg-[#181818]/50 px-6 py-10 text-center">
          <p className="text-sm text-[#b3b3b3]">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </section>
  )
}
