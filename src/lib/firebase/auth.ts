import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth'
import { getFirebaseAuth } from './app'

export interface SignUpInput {
  email: string
  password: string
  displayName: string
}

export async function signUp({
  email,
  password,
  displayName,
}: SignUpInput): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  )

  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() })
  }

  return credential
}

export async function signIn(
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth())
}

export function toUserSession(user: User) {
  return {
    name: user.displayName?.trim() || user.email?.split('@')[0] || 'User',
    email: user.email ?? '',
  }
}
