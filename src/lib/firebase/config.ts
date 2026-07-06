export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const ENV_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
} as const

function readConfigValue(key: keyof typeof ENV_KEYS): string | undefined {
  const envKey = ENV_KEYS[key]
  const value = import.meta.env[envKey]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey = readConfigValue('apiKey')
  const authDomain = readConfigValue('authDomain')
  const projectId = readConfigValue('projectId')
  const storageBucket = readConfigValue('storageBucket')
  const messagingSenderId = readConfigValue('messagingSenderId')
  const appId = readConfigValue('appId')

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  }
}

export const isFirebaseConfigured = getFirebaseConfig() !== null
