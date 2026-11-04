"use client"
import type { ReactNode } from "react"
import { useAuth } from "@/lib/queries"
import type { Profile } from "@/lib/types"
import RequireAuth from "./RequireAuth"

type RenderWithProfile = (me: Profile) => ReactNode

function ProfileGate({ children }: { children: RenderWithProfile }) {
  const { profile } = useAuth()
  return profile ? children(profile) : null
}

/** Signed-in pages that need the viewer's profile receive it directly: `{(me) => <Page me={me} />}`. */
export default function RequireProfile({ children }: { children: RenderWithProfile }) {
  return (
    <RequireAuth>
      <ProfileGate>{children}</ProfileGate>
    </RequireAuth>
  )
}
