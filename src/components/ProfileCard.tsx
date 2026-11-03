import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useOptionLabels } from "@/lib/labels"
import type { ConnectionStatus, Profile } from "@/lib/types"
import { Avatar, Tag } from "./ui"

const STATUS_KEYS: Partial<Record<ConnectionStatus, "connected" | "pending">> = { accepted: "connected", pending: "pending" }

export default function ProfileCard({ profile, connectionStatus }: { profile: Profile; connectionStatus?: ConnectionStatus }) {
  const t = useTranslations("ProfileCard")
  const labels = useOptionLabels()
  const { uid, displayName, role, headline, categories, platforms, city, audienceAge, followers } = profile
  const firstCategory = categories[0]
  const meta = [headline || (firstCategory && labels.category(firstCategory)), city].filter(Boolean).join(" · ")
  const statusKey = connectionStatus && STATUS_KEYS[connectionStatus]
  const tags = role === "creator" ? platforms.map(labels.platform) : categories.map(labels.category)

  return (
    <Link
      href={`/u/${uid}`}
      className="group flex flex-col gap-3.5 rounded-[18px] border border-line bg-white p-5 transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-3">
        <Avatar name={displayName} role={role} />
        <div className="flex min-w-0 flex-col">
          <strong className="truncate text-base group-hover:text-brand">{displayName}</strong>
          <span className="truncate text-sm text-muted">{meta || t("inProgress")}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {audienceAge && <Tag>{t("audience", { age: audienceAge })}</Tag>}
        {followers && <Tag>{labels.followers(followers)}</Tag>}
      </div>
      {statusKey && (
        <span className="mt-auto self-start">
          <Tag tone={statusKey === "connected" ? "brand" : "sun"}>{t(statusKey)}</Tag>
        </span>
      )}
    </Link>
  )
}
