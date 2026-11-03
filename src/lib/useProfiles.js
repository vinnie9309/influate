"use client"
import { useEffect, useState } from "react"
import { getProfile } from "./data"

// Loads the public profiles for a list of uids, fetching each one once.
export default function useProfiles(uids) {
  const [profiles, setProfiles] = useState({})
  const key = [...new Set(uids)].sort().join(",")

  useEffect(() => {
    const missing = key.split(",").filter((uid) => uid && !(uid in profiles))
    if (!missing.length) return
    Promise.all(missing.map((uid) => getProfile(uid).then((p) => [uid, p]))).then((entries) =>
      setProfiles((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
    )
    // profiles is read only to skip already-loaded uids
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return profiles
}
