import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

interface PageLayoutProps {
  children: ReactNode
  showFooter?: boolean
  className?: string
  navbar?: 'default' | 'solid'
}

export function PageLayout({
  children,
  showFooter = true,
  className = '',
  navbar = 'default',
}: PageLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-surface-base font-sans text-white antialiased ${className}`}
    >
      <Navbar variant={navbar} />
      {children}
      {showFooter && <Footer />}
    </div>
  )
}
