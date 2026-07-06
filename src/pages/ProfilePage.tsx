import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { ProfileSection } from '@/components/profile/ProfileSection'
import { ProfileShowRow } from '@/components/profile/ProfileShowRow'
import { ROUTES } from '@/constants/routes'
import { useProfile } from '@/context/ProfileContext'
import { useShowActions } from '@/hooks/useShowActions'

function formatWatchedAt(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

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
      <div className="min-h-screen bg-[#141414] font-sans text-white antialiased">
        <Navbar />
        <main className="flex flex-col items-center justify-center px-6 pt-32 text-center">
          <h1 className="text-2xl font-bold">You&apos;re signed out</h1>
          <p className="mt-2 text-sm text-[#b3b3b3]">
            Your list and history are still saved on this device.
          </p>
          <button
            type="button"
            onClick={signIn}
            className="mt-6 rounded bg-[#e50914] px-8 py-2.5 text-sm font-semibold transition hover:bg-[#f40612]"
          >
            Sign In
          </button>
          <Link to={ROUTES.HOME} className="mt-4 text-sm text-[#b3b3b3] hover:text-white">
            Back to Home
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] font-sans text-white antialiased">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-[clamp(1rem,4vw,3.75rem)] pt-24 pb-16">
        <header className="mb-10 flex items-center gap-5 border-b border-[#2f2f2f] pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded bg-[#e50914] text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="mt-1 text-sm text-[#b3b3b3]">{user.email}</p>
          </div>
        </header>

        <ProfileSection
          title="My List"
          isEmpty={watchlist.length === 0}
          emptyMessage="Nothing saved yet. Browse shows and add them to your list."
          action={
            watchlist.length === 0 ? (
              <Link to={ROUTES.BROWSE} className="text-sm text-[#e50914] hover:underline">
                Browse
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
          emptyMessage="Shows you open will appear here."
        >
          <ProfileShowRow shows={historyShows} onSelect={handleShowClick} />
          {history.length > 0 && (
            <ul className="mt-4 space-y-1 text-xs text-[#808080]">
              {history.slice(0, 5).map((entry) => (
                <li key={`${entry.show.id}-${entry.watchedAt}`}>
                  {entry.show.title} · {formatWatchedAt(entry.watchedAt)}
                </li>
              ))}
            </ul>
          )}
        </ProfileSection>

        <div className="mt-12 border-t border-[#2f2f2f] pt-8">
          <button
            type="button"
            onClick={signOut}
            className="w-full max-w-xs rounded border border-[#808080] px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 sm:w-auto"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
