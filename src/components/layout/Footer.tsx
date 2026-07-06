import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { BRAND } from '@/constants/brand'
import { ROUTES } from '@/constants/routes'

const links = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'TV Shows', to: ROUTES.BROWSE },
  { label: 'Search', to: ROUTES.SEARCH },
  { label: 'Profile', to: ROUTES.PROFILE },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-base px-page-x py-10">
      <div className="mx-auto max-w-content">
        <BrandLogo size="footer" />
        <p className="mt-4 max-w-sm text-sm text-muted">{BRAND.footerLine}</p>
        <nav
          className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4"
          aria-label="Footer"
        >
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-muted transition hover:text-white hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs text-subtle">
          Demo app · TV data from{' '}
          <a
            href="https://www.tvmaze.com/api"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-muted"
          >
            TVMaze
          </a>
        </p>
      </div>
    </footer>
  )
}
