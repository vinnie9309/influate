"use client"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "./ui"

// Gate for signed-in pages. Users without a profile are sent to finish it first.
export default function RequireAuth({ children, allowMissingProfile = false }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const needsLogin = !loading && !user
  const needsProfile = !loading && user && !profile && !allowMissingProfile

  useEffect(() => {
    if (needsLogin) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    else if (needsProfile) router.replace("/profile/edit")
  }, [needsLogin, needsProfile, pathname, router])

  if (loading || needsLogin || needsProfile) return <Spinner />
  return children
}
