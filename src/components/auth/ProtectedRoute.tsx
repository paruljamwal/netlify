import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute() {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  if (loading) {
    return (
      <PageLayout showFooter={false} navbar="solid">
        <main className="flex min-h-[70vh] items-center justify-center">
          <div
            className="h-11 w-11 animate-spin rounded-full border-2 border-muted border-t-white"
            aria-label="Loading"
          />
        </main>
      </PageLayout>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}
