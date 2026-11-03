import Link from "next/link"
import type { ConnectionStatus, Profile } from "@/lib/types"
import { Avatar, Tag } from "./ui"

const statusLabels: Partial<Record<ConnectionStatus, string>> = { accepted: "Connected", pending: "Request pending" }

export default function ProfileCard({ profile, connectionStatus }: { profile: Profile; connectionStatus?: ConnectionStatus }) {
  const { uid, displayName, role, headline, categories, platforms, city, audienceAge, followers } = profile
  const meta = [headline || categories[0], city].filter(Boolean).join(" · ")
  const label = connectionStatus && statusLabels[connectionStatus]
  return (
    <Link
      href={`/u/${uid}`}
      className="group flex flex-col gap-3.5 rounded-[18px] border border-line bg-white p-5 transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-3">
        <Avatar name={displayName} role={role} />
        <div className="flex min-w-0 flex-col">
          <strong className="truncate text-base group-hover:text-brand">{displayName}</strong>
          <span className="truncate text-sm text-muted">{meta || "Profile in progress"}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(role === "creator" ? platforms : categories).slice(0, 3).map((p) => (
          <Tag key={p}>{p}</Tag>
        ))}
        {audienceAge && <Tag>Audience {audienceAge}</Tag>}
        {followers && <Tag>{followers}</Tag>}
      </div>
      {label && (
        <span className="mt-auto self-start">
          <Tag tone={connectionStatus === "accepted" ? "brand" : "sun"}>{label}</Tag>
        </span>
      )}
    </Link>
  )
}
