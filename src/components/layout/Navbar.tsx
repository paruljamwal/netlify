import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    pathname === path
      ? 'text-sm font-semibold text-white'
      : 'text-sm font-medium text-[#b3b3b3] transition hover:text-white'

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 bg-gradient-to-b from-[#141414]/90 to-transparent transition-colors duration-300 hover:bg-[#141414]">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-[clamp(1rem,4vw,3.75rem)]">
        <div className="flex items-center gap-8">
          <Link
            to={ROUTES.HOME}
            className="text-xl font-extrabold tracking-wider text-[#e50914]"
          >
            NETFLIX
          </Link>
          <nav className="hidden items-center gap-6 min-[900px]:flex" aria-label="Main">
            <Link to={ROUTES.HOME} className={linkClass(ROUTES.HOME)}>
              Home
            </Link>
            <Link to={ROUTES.BROWSE} className={linkClass(ROUTES.BROWSE)}>
              TV Shows
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-[#b3b3b3] transition hover:text-white"
            >
              Movies
            </a>
            <a
              href="#"
              className="text-sm font-medium text-[#b3b3b3] transition hover:text-white"
            >
              New &amp; Popular
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-1 text-xl text-white transition hover:opacity-70"
            aria-label="Search"
          >
            ⌕
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded bg-[#e50914] text-sm font-bold text-white transition hover:scale-105"
            aria-label="Profile"
          >
            P
          </button>
        </div>
      </div>
    </header>
  )
}
