"use client"
import type { ReactNode } from "react"
import { redirect, usePathname } from "next/navigation"
import { useAuth } from "@/lib/queries"
import { Spinner } from "./ui"

// Gate for signed-in pages. Users without a profile are sent to finish it first.
export default function RequireAuth({ children, allowMissingProfile = false }: { children: ReactNode; allowMissingProfile?: boolean }) {
  const { user, profile, loading } = useAuth()
  const pathname = usePathname()

  if (loading) return <Spinner />
  if (!user) redirect(`/login?next=${encodeURIComponent(pathname)}`)
  if (!profile && !allowMissingProfile) redirect("/profile/edit")
  return children
}
