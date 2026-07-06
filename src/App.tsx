import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
