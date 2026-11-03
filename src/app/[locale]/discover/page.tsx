"use client"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { AUDIENCE_AGES, CATEGORIES, PLATFORMS, otherRole } from "@/lib/constants"
import { useOptionLabels } from "@/lib/labels"
import { useMyConnections, useSearchProfiles } from "@/lib/queries"
import type { ConnectionStatus, Profile, Role } from "@/lib/types"
import ProfileCard from "@/components/ProfileCard"
import RequireProfile from "@/components/RequireProfile"
import { ChipToggle, PageTitle, SearchInput, SegmentedControl, Select, Spinner } from "@/components/ui"

const ROLE_VALUES: readonly Role[] = ["creator", "brand"]

function Discover({ me }: { me: Profile }) {
  const t = useTranslations("Discover")
  const tRoles = useTranslations("Roles")
  const tCommon = useTranslations("Common")
  const labels = useOptionLabels()
  const [role, setRole] = useState<Role>(otherRole(me.role))
  const [category, setCategory] = useState("")
  const [text, setText] = useState("")
  const [platform, setPlatform] = useState("")
  const [age, setAge] = useState("")
  const search = useSearchProfiles(role, category)
  const connections = useMyConnections(me.uid)

  const statusByUid = useMemo(
    () =>
      new Map<string, ConnectionStatus>(
        (connections.data ?? []).map(({ participants, status }) => [participants.find((p) => p !== me.uid) ?? "", status])
      ),
    [connections.data, me.uid]
  )

  // Firestore filters by role and category; the rest is narrowed here.
  const filtered = useMemo(() => {
    const needle = text.trim().toLowerCase()
    return search.data
      ?.filter((p) => p.uid !== me.uid)
      .filter((p) => !platform || p.platforms.includes(platform))
      .filter((p) => !age || p.audienceAge === age)
      .filter((p) => !needle || [p.displayName, p.headline, p.city, p.bio, p.targetAudience].join(" ").toLowerCase().includes(needle))
      .toSorted((a, b) => (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0))
  }, [search.data, text, platform, age, me.uid])

  const roleOptions = ROLE_VALUES.map((value) => ({ value, label: tRoles("plural", { role: value }) }))

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 pb-24 pt-4">
      <PageTitle eyebrow={t("eyebrow")} title={t("title", { role })}>
        {t("intro")}
      </PageTitle>

      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-6 shadow-float">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl label={t("show")} options={roleOptions} value={role} onChange={setRole} />
          <SearchInput className="flex-[1_1_260px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("searchPlaceholder")} />
          {role === "creator" && (
            <Select
              aria-label={t("platform")}
              className="w-auto"
              options={PLATFORMS}
              optionLabel={labels.platform}
              placeholder={t("anyPlatform")}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          )}
          <Select
            aria-label={t("audienceAge")}
            className="w-auto"
            options={AUDIENCE_AGES}
            placeholder={t("anyAge")}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("category")}>
          <ChipToggle selected={!category} onClick={() => setCategory("")}>
            {t("all")}
          </ChipToggle>
          {CATEGORIES.map((c) => (
            <ChipToggle key={c} selected={category === c} onClick={() => setCategory(category === c ? "" : c)}>
              {labels.category(c)}
            </ChipToggle>
          ))}
        </div>

        {!filtered ? (
          <Spinner label={tCommon("searching")} />
        ) : filtered.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {filtered.map((p) => (
              <ProfileCard key={p.uid} profile={p} connectionStatus={statusByUid.get(p.uid)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-bold">{t("emptyTitle", { role })}</p>
            <p className="max-w-md text-[15px] text-muted">{t("emptyText")}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function DiscoverPage() {
  return <RequireProfile>{(me) => <Discover me={me} />}</RequireProfile>
}
