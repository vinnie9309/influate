"use client"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { AUDIENCE_AGES, CATEGORIES, PLATFORMS, ROLES, otherRole } from "@/lib/constants"
import { useAuth, useMyConnections, useSearchProfiles } from "@/lib/queries"
import type { ConnectionStatus, Profile, Role } from "@/lib/types"
import RequireAuth from "@/components/RequireAuth"
import ProfileCard from "@/components/ProfileCard"
import { ChipToggle, PageTitle, Spinner } from "@/components/ui"

const selectClasses = "h-12 rounded-xl border border-line-strong bg-white px-3 text-[15px] text-subtle"
const ROLE_TABS: readonly Role[] = ["creator", "brand"]

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
          <div className="flex rounded-xl bg-mist p-1" role="group" aria-label="Show">
            {ROLE_TABS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={role === r}
                onClick={() => setRole(r)}
                className={`h-10 rounded-lg px-4 text-sm font-bold ${role === r ? "bg-white text-ink shadow-xs" : "text-muted"}`}
              >
                {ROLES[r].plural}
              </button>
            ))}
          </div>
          <label className="flex h-12 min-w-0 flex-[1_1_260px] items-center gap-2.5 rounded-xl border border-line-strong px-3.5">
            <Search aria-hidden="true" className="h-[18px] w-[18px] text-muted" />
            <span className="sr-only">Search</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search by name, city or keyword"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-hidden"
            />
          </label>
          {role === "creator" && (
            <select aria-label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClasses}>
              <option value="">Any platform</option>
              {PLATFORMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          )}
          <select aria-label="Audience age" value={age} onChange={(e) => setAge(e.target.value)} className={selectClasses}>
            <option value="">Any audience age</option>
            {AUDIENCE_AGES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
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

function DiscoverForMe() {
  const { profile } = useAuth()
  return profile && <Discover me={profile} />
}

export default function DiscoverPage() {
  return (
    <RequireAuth>
      <DiscoverForMe />
    </RequireAuth>
  )
}
