import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConnectionStatusModal } from '@/components/common/ConnectionStatusModal'
import { AnimatedOutlet } from '@/components/layout/AnimatedOutlet'
import { DetailModalProvider } from '@/context/DetailModalContext'
import { NetworkProvider } from '@/context/NetworkContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'
import { SearchPage } from '@/pages/SearchPage'
import { ProfilePage } from '@/pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <NetworkProvider>
        <ProfileProvider>
          <DetailModalProvider>
            <ConnectionStatusModal />
            <Routes>
              <Route element={<AnimatedOutlet />}>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
                <Route path={ROUTES.SEARCH} element={<SearchPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              </Route>
            </Routes>
          </DetailModalProvider>
        </ProfileProvider>
      </NetworkProvider>
    </BrowserRouter>
  )
}

export default App
