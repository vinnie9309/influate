import Link from "next/link"
import { Avatar, Tag } from "./ui"

const statusLabels = { accepted: "Connected", pending: "Request pending" }

export default function ProfileCard({ profile, connectionStatus }) {
  const meta = [profile.headline || profile.categories?.[0], profile.city].filter(Boolean).join(" · ")
  return (
    <Link
      href={`/u/${profile.uid}`}
      className="group flex flex-col gap-3.5 rounded-[18px] border border-line bg-white p-5 transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-3">
        <Avatar name={profile.displayName} role={profile.role} />
        <div className="flex min-w-0 flex-col">
          <strong className="truncate text-base group-hover:text-brand">{profile.displayName}</strong>
          <span className="truncate text-sm text-muted">{meta || "Profile in progress"}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(profile.role === "creator" ? profile.platforms : profile.categories)?.slice(0, 3).map((p) => (
          <Tag key={p}>{p}</Tag>
        ))}
        {profile.audienceAge && <Tag>Audience {profile.audienceAge}</Tag>}
        {profile.followers && <Tag>{profile.followers}</Tag>}
      </div>
      {statusLabels[connectionStatus] && (
        <span className="mt-auto self-start">
          <Tag tone={connectionStatus === "accepted" ? "brand" : "sun"}>{statusLabels[connectionStatus]}</Tag>
        </span>
      )}
    </Link>
  )
}
