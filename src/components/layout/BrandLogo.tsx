import { Link } from 'react-router-dom'
import { BRAND } from '@/constants/brand'
import { ROUTES } from '@/constants/routes'

type BrandLogoProps = {
  size?: 'nav' | 'footer'
}

export function BrandLogo({ size = 'nav' }: BrandLogoProps) {
  const isNav = size === 'nav'

  return (
    <Link
      to={ROUTES.HOME}
      className={`group inline-flex items-center gap-2 ${isNav ? 'shrink-0' : ''}`}
      aria-label={`${BRAND.name} home`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-md bg-brand font-black text-white shadow-[0_2px_12px_rgba(229,9,20,0.45)] transition group-hover:bg-brand-hover ${
          isNav ? 'h-7 w-7 text-[11px]' : 'h-8 w-8 text-xs'
        }`}
        aria-hidden="true"
      >
        ▶
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-[0.18em] text-white ${
            isNav ? 'text-[1.2rem] min-[900px]:text-[1.35rem]' : 'text-2xl'
          }`}
        >
          {BRAND.name}
        </span>
        {!isNav && (
          <span className="mt-1.5 text-xs font-medium tracking-wide text-muted">
            {BRAND.tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
