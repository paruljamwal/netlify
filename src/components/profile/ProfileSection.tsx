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
        <h2 className="section-title">{title}</h2>
        {action}
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-surface-border bg-surface-raised/50 px-6 py-12 text-center">
          <p className="text-sm text-muted">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </section>
  )
}
