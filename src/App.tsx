import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'
import { SearchPage } from '@/pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
