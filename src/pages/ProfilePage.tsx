import { Link } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { ProfileSection } from '@/components/profile/ProfileSection'
import { ProfileShowRow } from '@/components/profile/ProfileShowRow'
import { ROUTES } from '@/constants/routes'
import { useProfile } from '@/context/ProfileContext'
import { useShowActions } from '@/hooks/useShowActions'

export function ProfilePage() {
  const {
    user,
    watchlist,
    history,
    removeFromWatchlist,
    signIn,
    signOut,
  } = useProfile()
  const { handleShowClick } = useShowActions()

  const historyShows = history.map((e) => e.show)

  if (!user) {
    return (
      <PageLayout showFooter={false} navbar="solid">
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-page-x pt-24 text-center">
          <div className="max-w-sm rounded-lg bg-surface-raised p-8 ring-1 ring-surface-border">
            <h1 className="text-2xl font-bold">You&apos;re signed out</h1>
            <p className="mt-2 text-sm text-muted">
              Your list and history stay on this device.
            </p>
            <button
              type="button"
              onClick={signIn}
              className="mt-6 w-full rounded bg-brand px-8 py-2.5 text-sm font-semibold transition hover:bg-brand-hover"
            >
              Sign In
            </button>
            <Link
              to={ROUTES.HOME}
              className="mt-4 inline-block text-sm text-muted hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout navbar="solid">
      <main className="mx-auto max-w-[1200px] px-page-x pt-24 pb-12">
        <header className="mb-10 flex flex-col gap-6 border-b border-surface-border pb-8 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-brand text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Account
            </p>
            <h1 className="mt-1 text-3xl font-bold">{user.name}</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Stat label="My List" value={watchlist.length} />
            <Stat label="Watched" value={history.length} />
          </div>
        </header>

        <ProfileSection
          title="My List"
          isEmpty={watchlist.length === 0}
          emptyMessage="Save shows with the + button while browsing."
          action={
            watchlist.length === 0 ? (
              <Link
                to={ROUTES.BROWSE}
                className="text-sm font-medium text-brand hover:underline"
              >
                Browse shows
              </Link>
            ) : undefined
          }
        >
          <ProfileShowRow
            shows={watchlist}
            onRemove={removeFromWatchlist}
            onSelect={handleShowClick}
          />
        </ProfileSection>

        <ProfileSection
          title="Watch History"
          isEmpty={history.length === 0}
          emptyMessage="Open a show to add it here."
        >
          <ProfileShowRow shows={historyShows} onSelect={handleShowClick} />
        </ProfileSection>

        <div className="mt-12 border-t border-surface-border pt-8">
          <button
            type="button"
            onClick={signOut}
            className="w-full max-w-xs rounded border border-subtle px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 sm:w-auto"
          >
            Sign Out
          </button>
        </div>
      </main>
    </PageLayout>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-surface-raised px-4 py-3 text-center ring-1 ring-surface-border">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}
