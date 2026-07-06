import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirebaseConfig } from './config'

let app: FirebaseApp | null = null
let auth: Auth | null = null

export function getFirebaseApp(): FirebaseApp {
  if (app) return app

  const config = getFirebaseConfig()
  if (!config) {
    throw new Error(
      'Firebase is not configured. Add VITE_FIREBASE_* variables to your .env file.',
    )
  }

  app = initializeApp(config)
  return app
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth
  auth = getAuth(getFirebaseApp())
  return auth
}
