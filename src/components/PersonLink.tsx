import { Link } from "@/i18n/navigation"
import type { ReactNode } from "react"
import type { Profile } from "@/lib/types"
import { Avatar } from "./ui"

interface PersonLinkProps {
  uid: string
  /** Undefined while loading; the name shows as "…" until it arrives. */
  profile: Profile | null | undefined
  size?: number
  /** A second line under the name. */
  children?: ReactNode
}

/** Avatar and name linking to someone's public profile. */
export default function PersonLink({ uid, profile, size = 40, children }: PersonLinkProps) {
  return (
    <Link href={`/u/${uid}`} className="flex min-w-0 items-center gap-3 text-ink hover:text-brand">
      <Avatar name={profile?.displayName} role={profile?.role} size={size} />
      <span className="flex min-w-0 flex-col">
        <strong className="truncate text-[15px]">{profile?.displayName ?? "…"}</strong>
        {children}
      </span>
    </Link>
  )
}
