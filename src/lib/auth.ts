import { useSyncExternalStore } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./firebase"

// A tiny external store around Firebase's auth listener, read with useSyncExternalStore
// so no component has to subscribe in an effect.

interface AuthSnapshot {
  user: User | null
  /** False until Firebase has restored (or ruled out) a signed-in session. */
  ready: boolean
}

const serverSnapshot: AuthSnapshot = { user: null, ready: false }
let snapshot: AuthSnapshot = serverSnapshot
const listeners = new Set<() => void>()
let stopListening: (() => void) | null = null

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  stopListening ??= onAuthStateChanged(auth, (user) => {
    snapshot = { user, ready: true }
    listeners.forEach((notify) => notify())
  })
  return () => {
    listeners.delete(listener)
  }
}

export const useAuthUser = (): AuthSnapshot =>
  useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot)
