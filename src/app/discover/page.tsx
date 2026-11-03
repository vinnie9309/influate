"use client"
import { useMemo, useState } from "react"
import { AUDIENCE_AGES, CATEGORIES, PLATFORMS, ROLES, otherRole } from "@/lib/constants"
import { useMyConnections, useSearchProfiles } from "@/lib/queries"
import type { ConnectionStatus, Profile, Role } from "@/lib/types"
import ProfileCard from "@/components/ProfileCard"
import RequireProfile from "@/components/RequireProfile"
import { ChipToggle, PageTitle, SearchInput, SegmentedControl, Select, Spinner } from "@/components/ui"

const ROLE_OPTIONS: readonly { value: Role; label: string }[] = [
  { value: "creator", label: ROLES.creator.plural },
  { value: "brand", label: ROLES.brand.plural }
]

function Discover({ me }: { me: Profile }) {
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

  const plural = ROLES[role].plural.toLowerCase()

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 pb-24 pt-4">
      <PageTitle eyebrow="Discover" title={`Find ${plural} that fit`}>
        Filter by category, audience and platform, then open a profile to send a connect request.
      </PageTitle>

      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-6 shadow-float">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl label="Show" options={ROLE_OPTIONS} value={role} onChange={setRole} />
          <SearchInput
            className="flex-[1_1_260px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by name, city or keyword"
          />
          {role === "creator" && (
            <Select
              aria-label="Platform"
              className="w-auto"
              options={PLATFORMS}
              placeholder="Any platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          )}
          <Select
            aria-label="Audience age"
            className="w-auto"
            options={AUDIENCE_AGES}
            placeholder="Any audience age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          <ChipToggle selected={!category} onClick={() => setCategory("")}>
            All
          </ChipToggle>
          {CATEGORIES.map((c) => (
            <ChipToggle key={c} selected={category === c} onClick={() => setCategory(category === c ? "" : c)}>
              {c}
            </ChipToggle>
          ))}
        </div>

        {!filtered ? (
          <Spinner label="Searching…" />
        ) : filtered.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {filtered.map((p) => (
              <ProfileCard key={p.uid} profile={p} connectionStatus={statusByUid.get(p.uid)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-bold">No {plural} match yet</p>
            <p className="max-w-md text-[15px] text-muted">Try another category or clear the filters. New profiles join every day.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function DiscoverPage() {
  return <RequireProfile>{(me) => <Discover me={me} />}</RequireProfile>
}
