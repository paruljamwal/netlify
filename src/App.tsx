import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ConnectionStatusModal } from '@/components/common/ConnectionStatusModal'
import { AnimatedOutlet } from '@/components/layout/AnimatedOutlet'
import { AuthProvider } from '@/context/AuthContext'
import { DetailModalProvider } from '@/context/DetailModalContext'
import { NetworkProvider } from '@/context/NetworkContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { ROUTES } from '@/constants/routes'
import { AuthPage } from '@/pages/AuthPage'
import { HomePage } from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'
import { SearchPage } from '@/pages/SearchPage'
import { ProfilePage } from '@/pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <NetworkProvider>
        <AuthProvider>
          <ProfileProvider>
            <DetailModalProvider>
              <ConnectionStatusModal />
              <Routes>
                <Route path={ROUTES.LOGIN} element={<AuthPage mode="login" />} />
                <Route path={ROUTES.SIGNUP} element={<AuthPage mode="signup" />} />
                <Route element={<AnimatedOutlet />}>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
                  <Route path={ROUTES.SEARCH} element={<SearchPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  </Route>
                </Route>
              </Routes>
            </DetailModalProvider>
          </ProfileProvider>
        </AuthProvider>
      </NetworkProvider>
    </BrowserRouter>
  )
}

export default App
