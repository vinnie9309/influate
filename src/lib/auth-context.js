"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { watchProfile } from "./data"

const AuthContext = createContext({ user: null, profile: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let stopProfile = () => {}
    const stopAuth = onAuthStateChanged(auth, (nextUser) => {
      stopProfile()
      setUser(nextUser)
      if (!nextUser) {
        setProfile(null)
        setLoading(false)
        return
      }
      setLoading(true)
      stopProfile = watchProfile(nextUser.uid, (p) => {
        setProfile(p)
        setLoading(false)
      })
    })
    return () => {
      stopProfile()
      stopAuth()
    }
  }, [])

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
