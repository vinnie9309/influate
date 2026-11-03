"use client"
import type { ReactNode } from "react"
import { useLocale } from "next-intl"
import { redirect, usePathname } from "@/i18n/navigation"
import { useAuth } from "@/lib/queries"
import { Spinner } from "./ui"

// Gate for signed-in pages. Users without a profile are sent to finish it first.
export default function RequireAuth({ children, allowMissingProfile = false }: { children: ReactNode; allowMissingProfile?: boolean }) {
  const { user, profile, loading } = useAuth()
  const locale = useLocale()
  const pathname = usePathname()

  if (loading) return <Spinner />
  if (!user) redirect({ href: `/login?next=${encodeURIComponent(pathname)}`, locale })
  if (!profile && !allowMissingProfile) redirect({ href: "/profile/edit", locale })
  return children
}
