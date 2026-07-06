import { createContext, useContext, type ReactNode } from 'react'

/** Shared UI state (theme, selected profile, watchlist) lives here */
type AppContextValue = {
  // define your state shape as you build features
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const value: AppContextValue = {}

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
