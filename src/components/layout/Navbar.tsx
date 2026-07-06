import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { SearchIcon } from '@/components/common/SearchIcon'
import { ROUTES } from '@/constants/routes'
import { useNetwork } from '@/context/NetworkContext'
import { useProfile } from '@/context/ProfileContext'

const navLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'TV Shows', to: ROUTES.BROWSE },
  { label: 'Search', to: ROUTES.SEARCH },
  { label: 'My List', to: ROUTES.PROFILE },
]

export function Navbar({ variant = 'default' }: { variant?: 'default' | 'solid' }) {
  const { pathname } = useLocation()
  const { isOnline } = useNetwork()
  const { user } = useProfile()
  const [scrolled, setScrolled] = useState(variant === 'solid')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (variant === 'solid') return
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [variant])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const linkClass = (path: string) => {
    const active = pathname === path
    return active
      ? 'text-sm font-semibold text-white'
      : 'text-sm font-medium text-muted transition hover:text-white'
  }

  const initial = user?.name.charAt(0).toUpperCase() ?? 'P'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'bg-surface-base/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-page-x">
        <div className="flex items-center gap-6 min-[900px]:gap-10">
          <BrandLogo size="nav" />

          <nav
            className="hidden items-center gap-6 min-[900px]:flex"
            aria-label="Main"
          >
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} className={linkClass(to)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {!isOnline && (
            <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted ring-1 ring-surface-border sm:text-xs">
              Offline
            </span>
          )}

          <Link
            to={ROUTES.SEARCH}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded text-white transition hover:bg-white/10 hover:ring-2 hover:ring-white/20 ${
              pathname === ROUTES.SEARCH
                ? 'bg-white/10 ring-2 ring-white/30'
                : ''
            }`}
            aria-label="Search"
            aria-current={pathname === ROUTES.SEARCH ? 'page' : undefined}
          >
            <SearchIcon size={18} />
          </Link>

          <Link
            to={ROUTES.PROFILE}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-brand text-sm font-bold text-white transition hover:bg-brand-hover hover:ring-2 hover:ring-white/30"
            aria-label="Profile"
          >
            {initial}
          </Link>

          <button
            type="button"
            className="cursor-pointer rounded p-2 text-white min-[900px]:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-surface-border bg-surface-base/98 px-page-x py-4 min-[900px]:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`block rounded px-3 py-2.5 ${pathname === to ? 'bg-surface-elevated font-semibold text-white' : 'text-muted hover:bg-surface-elevated/60 hover:text-white'}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
