import { Outlet, useLocation } from 'react-router-dom'

export function AnimatedOutlet() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="animate-page-in">
      <Outlet />
    </div>
  )
}
