import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'
import { getAuthErrorMessage } from '@/utils/authErrors'

type AuthMode = 'login' | 'signup'

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, configured } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? ROUTES.HOME

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)

    try {
      if (isSignup) {
        await signUp({ email, password, displayName: name })
      } else {
        await signIn(email, password)
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout showFooter={false} navbar="solid">
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-page-x pt-24 pb-12">
        <div className="w-full max-w-md rounded-lg bg-surface-raised p-8 ring-1 ring-surface-border">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            {isSignup ? 'Create account' : 'Welcome back'}
          </p>
          <h1 className="mt-2 text-2xl font-bold">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isSignup
              ? 'Create an account to save your list and history.'
              : 'Sign in to access your profile and watchlist.'}
          </p>

          {!configured && (
            <p className="mt-4 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-white/90">
              Firebase is not configured. Copy{' '}
              <code className="text-brand">.env.example</code> to{' '}
              <code className="text-brand">.env</code> and add your Firebase
              keys.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-md border border-surface-border bg-surface-base px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-md border border-surface-border bg-surface-base px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="w-full rounded-md border border-surface-border bg-surface-base px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="At least 6 characters"
              />
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">
                  Confirm password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-md border border-surface-border bg-surface-base px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand"
                  placeholder="Repeat password"
                />
              </label>
            )}

            {error && (
              <p className="rounded-md bg-brand/10 px-3 py-2 text-sm text-brand">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !configured}
              className="w-full rounded bg-brand px-8 py-2.5 text-sm font-semibold transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? isSignup
                  ? 'Creating account…'
                  : 'Signing in…'
                : isSignup
                  ? 'Sign Up'
                  : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              to={isSignup ? ROUTES.LOGIN : ROUTES.SIGNUP}
              className="font-semibold text-white hover:underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </Link>
          </p>

          <Link
            to={ROUTES.HOME}
            className="mt-4 block text-center text-sm text-muted hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </PageLayout>
  )
}
