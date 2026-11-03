"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ROLES, formatMoney, otherRole } from "@/lib/constants"
import {
  removeConnection,
  respondToConnection,
  sumResults,
  watchMyConnections,
  watchMyPartnerships,
  watchMyResults
} from "@/lib/data"
import useProfiles from "@/lib/useProfiles"
import RequireAuth from "@/components/RequireAuth"
import { Avatar, Button, Card, PageTitle, Spinner, Tag } from "@/components/ui"

function Stat({ label, value }) {
  return (
    <Card className="flex flex-col gap-1 p-5">
      <span className="text-[13px] text-muted">{label}</span>
      <strong className="text-[28px] font-extrabold tracking-[-0.02em]">{value}</strong>
    </Card>
  )
}

function SectionCard({ title, action, children }) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  )
}

function PersonLink({ profile, uid, children }) {
  return (
    <Link href={`/u/${uid}`} className="flex min-w-0 items-center gap-3 text-ink hover:text-brand">
      <Avatar name={profile?.displayName} role={profile?.role} size={40} />
      <span className="flex min-w-0 flex-col">
        <strong className="truncate text-[15px]">{profile?.displayName ?? "…"}</strong>
        {children}
      </span>
    </Link>
  )
}

function Dashboard() {
  const { profile: me } = useAuth()
  const [connections, setConnections] = useState(null)
  const [partnerships, setPartnerships] = useState(null)
  const [results, setResults] = useState(null)

  useEffect(() => watchMyConnections(me.uid, setConnections), [me.uid])
  useEffect(() => watchMyPartnerships(me.uid, setPartnerships), [me.uid])
  useEffect(() => watchMyResults(me.uid, setResults), [me.uid])

  const otherUid = (participants) => participants.find((p) => p !== me.uid)
  const people = useProfiles([...(connections ?? []), ...(partnerships ?? [])].map((x) => otherUid(x.participants)))

  const stats = useMemo(() => {
    if (!results || !partnerships) return null
    const month = new Date().toISOString().slice(0, 7)
    const valueKey = me.role === "creator" ? "earnings" : "revenue"
    const byPartnership = {}
    for (const r of results) (byPartnership[r.partnershipId] ??= []).push(r)
    return {
      active: partnerships.filter((p) => p.status === "active").length,
      month: sumResults(results.filter((r) => r.date?.startsWith(month)))[valueKey],
      total: sumResults(results)[valueKey],
      byPartnership: Object.fromEntries(Object.entries(byPartnership).map(([id, rs]) => [id, sumResults(rs)]))
    }
  }, [results, partnerships, me.role])

  if (!connections || !stats) return <Spinner />

  const incoming = connections.filter((c) => c.status === "pending" && c.toUid === me.uid)
  const outgoing = connections.filter((c) => c.status === "pending" && c.fromUid === me.uid)
  const accepted = connections.filter((c) => c.status === "accepted")
  const isCreator = me.role === "creator"
  const lookingFor = ROLES[otherRole(me.role)].plural.toLowerCase()
  const sortedPartnerships = [...partnerships].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-24 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="Dashboard" title={`Hi, ${isCreator ? me.displayName.split(" ")[0] : me.displayName}`} />
        <Button href="/discover">Find {lookingFor}</Button>
      </div>

      {!me.categories?.length && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-sun-soft p-5">
          <p className="text-[15px] font-medium text-sun-ink">
            Finish your profile so {lookingFor} can find you in search.
          </p>
          <Button href="/profile/edit" variant="dark" size="sm">
            Complete profile
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Active partnerships" value={stats.active} />
        <Stat label={isCreator ? "Earned this month" : "Revenue this month"} value={formatMoney(stats.month)} />
        <Stat label={isCreator ? "Earned all time" : "Revenue all time"} value={formatMoney(stats.total)} />
        <Stat label="Requests waiting for you" value={incoming.length} />
      </div>

      {incoming.length > 0 && (
        <SectionCard title="Connect requests">
          <ul className="flex flex-col divide-y divide-line">
            {incoming.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <PersonLink uid={c.fromUid} profile={people[c.fromUid]}>
                  {c.note && <span className="line-clamp-1 text-sm text-muted">“{c.note}”</span>}
                </PersonLink>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => respondToConnection(c.id, "accepted")}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => respondToConnection(c.id, "declined")}>
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Partnerships">
        {sortedPartnerships.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-muted">
                  {["Partner", "Campaign", "Code", "Sales", "Revenue", "Creator earnings", "Status"].map((h) => (
                    <th key={h} scope="col" className="border-b border-line px-2 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPartnerships.map((p) => {
                  const t = stats.byPartnership[p.id] ?? { sales: 0, revenue: 0, earnings: 0 }
                  const partner = people[otherUid(p.participants)]
                  return (
                    <tr key={p.id} className="border-b border-mist last:border-0">
                      <td className="px-2 py-3 font-semibold">{partner?.displayName ?? "…"}</td>
                      <td className="px-2 py-3">
                        <Link href={`/partnerships/${p.id}`} className="font-semibold">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-2 py-3 font-mono">{p.code}</td>
                      <td className="px-2 py-3">{t.sales}</td>
                      <td className="px-2 py-3">{formatMoney(t.revenue)}</td>
                      <td className="px-2 py-3">{formatMoney(t.earnings)}</td>
                      <td className="px-2 py-3">
                        <Tag tone={p.status === "active" ? "brand" : "mist"}>{p.status === "active" ? "Active" : "Ended"}</Tag>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[15px] text-muted">
            No partnerships yet. Connect with {lookingFor}, then start a partnership from their profile.
          </p>
        )}
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Connections">
          {accepted.length ? (
            <ul className="flex flex-col gap-3">
              {accepted.map((c) => {
                const uid = otherUid(c.participants)
                return (
                  <li key={c.id}>
                    <PersonLink uid={uid} profile={people[uid]}>
                      <span className="truncate text-sm text-muted">{people[uid]?.headline || "Connected"}</span>
                    </PersonLink>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-[15px] text-muted">No connections yet.</p>
          )}
        </SectionCard>
        <SectionCard title="Requests you sent">
          {outgoing.length ? (
            <ul className="flex flex-col gap-3">
              {outgoing.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <PersonLink uid={c.toUid} profile={people[c.toUid]}>
                    <span className="text-sm text-muted">Waiting for a reply</span>
                  </PersonLink>
                  <Button size="sm" variant="ghost" onClick={() => removeConnection(c.id)}>
                    Withdraw
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-muted">Nothing pending.</p>
          )}
        </SectionCard>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  )
}
