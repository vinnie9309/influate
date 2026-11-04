import { useSyncExternalStore } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

// A tiny external store around Supabase's auth listener, read with useSyncExternalStore
// so no component has to subscribe in an effect.

interface AuthSnapshot {
  user: User | null
  /** False until Supabase has restored (or ruled out) a signed-in session. */
  ready: boolean
}

const serverSnapshot: AuthSnapshot = { user: null, ready: false }
let snapshot: AuthSnapshot = serverSnapshot
const listeners = new Set<() => void>()
let listening = false

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (!listening) {
    listening = true
    // Fires INITIAL_SESSION once the stored session (or OAuth redirect) has been processed.
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      if (snapshot.ready && snapshot.user?.id === user?.id) return
      snapshot = { user, ready: true }
      listeners.forEach((notify) => notify())
    })
  }
  return () => {
    listeners.delete(listener)
  }
}

export const useAuthUser = (): AuthSnapshot =>
  useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot)
