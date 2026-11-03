"use client"
import { useMemo, type ReactNode } from "react"
import Link from "next/link"
import { ROLES, formatMoney, otherRole } from "@/lib/constants"
import { emptyTotals, sumResults } from "@/lib/data"
import {
  useAuth,
  useMyConnections,
  useMyPartnerships,
  useMyResults,
  useProfiles,
  useRemoveConnection,
  useRespondToConnection
} from "@/lib/queries"
import type { PartnershipResult, Profile } from "@/lib/types"
import RequireAuth from "@/components/RequireAuth"
import { Avatar, Button, Card, PageTitle, Spinner, Tag } from "@/components/ui"

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Card className="flex flex-col gap-1 p-5">
      <span className="text-[13px] text-muted">{label}</span>
      <strong className="text-[28px] font-extrabold tracking-[-0.02em]">{value}</strong>
    </Card>
  )
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </Card>
  )
}

function PersonLink({ uid, profile, children }: { uid: string; profile: Profile | null | undefined; children: ReactNode }) {
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

const groupByPartnership = (results: readonly PartnershipResult[]) =>
  results.reduce((groups, r) => groups.set(r.partnershipId, [...(groups.get(r.partnershipId) ?? []), r]), new Map<string, PartnershipResult[]>())

const PARTNERSHIP_COLUMNS = ["Partner", "Campaign", "Code", "Sales", "Revenue", "Creator earnings", "Status"] as const

function Dashboard({ me }: { me: Profile }) {
  const connections = useMyConnections(me.uid)
  const partnerships = useMyPartnerships(me.uid)
  const results = useMyResults(me.uid)
  const respond = useRespondToConnection()
  const remove = useRemoveConnection()

  const otherUid = (participants: readonly string[]) => participants.find((p) => p !== me.uid) ?? ""
  const people = useProfiles([...(connections.data ?? []), ...(partnerships.data ?? [])].map((x) => otherUid(x.participants)))

  const isCreator = me.role === "creator"
  const valueKey = isCreator ? "earnings" : "revenue"

  const stats = useMemo(() => {
    if (!results.data || !partnerships.data) return null
    const month = new Date().toISOString().slice(0, 7)
    const totalsById = new Map(
      [...groupByPartnership(results.data)].map(([id, rows]) => [id, sumResults(rows)] as const)
    )
    return {
      active: partnerships.data.filter((p) => p.status === "active").length,
      month: sumResults(results.data.filter((r) => r.date.startsWith(month)))[valueKey],
      total: sumResults(results.data)[valueKey],
      totalsById
    }
  }, [results.data, partnerships.data, valueKey])

  if (!connections.data || !partnerships.data || !stats) return <Spinner />

  const incoming = connections.data.filter((c) => c.status === "pending" && c.toUid === me.uid)
  const outgoing = connections.data.filter((c) => c.status === "pending" && c.fromUid === me.uid)
  const accepted = connections.data.filter((c) => c.status === "accepted")
  const lookingFor = ROLES[otherRole(me.role)].plural.toLowerCase()
  const sortedPartnerships = partnerships.data.toSorted((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
  const greeting = isCreator ? me.displayName.split(" ")[0] : me.displayName

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-24 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="Dashboard" title={`Hi, ${greeting}`} />
        <Button href="/discover">Find {lookingFor}</Button>
      </div>

      {!me.categories.length && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-sun-soft p-5">
          <p className="text-[15px] font-medium text-sun-ink">Finish your profile so {lookingFor} can find you in search.</p>
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
            {incoming.map(({ id, fromUid, note }) => (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <PersonLink uid={fromUid} profile={people[fromUid]}>
                  {note && <span className="line-clamp-1 text-sm text-muted">“{note}”</span>}
                </PersonLink>
                <div className="flex gap-2">
                  <Button size="sm" disabled={respond.isPending} onClick={() => respond.mutate({ id, status: "accepted" })}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" disabled={respond.isPending} onClick={() => respond.mutate({ id, status: "declined" })}>
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
                  {PARTNERSHIP_COLUMNS.map((h) => (
                    <th key={h} scope="col" className="border-b border-line px-2 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPartnerships.map(({ id, participants, title, code, status }) => {
                  const { sales, revenue, earnings } = stats.totalsById.get(id) ?? emptyTotals()
                  return (
                    <tr key={id} className="border-b border-mist last:border-0">
                      <td className="px-2 py-3 font-semibold">{people[otherUid(participants)]?.displayName ?? "…"}</td>
                      <td className="px-2 py-3">
                        <Link href={`/partnerships/${id}`} className="font-semibold">
                          {title}
                        </Link>
                      </td>
                      <td className="px-2 py-3 font-mono">{code}</td>
                      <td className="px-2 py-3">{sales}</td>
                      <td className="px-2 py-3">{formatMoney(revenue)}</td>
                      <td className="px-2 py-3">{formatMoney(earnings)}</td>
                      <td className="px-2 py-3">
                        <Tag tone={status === "active" ? "brand" : "mist"}>{status === "active" ? "Active" : "Ended"}</Tag>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[15px] text-muted">No partnerships yet. Connect with {lookingFor}, then start a partnership from their profile.</p>
        )}
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Connections">
          {accepted.length ? (
            <ul className="flex flex-col gap-3">
              {accepted.map(({ id, participants }) => {
                const uid = otherUid(participants)
                return (
                  <li key={id}>
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
              {outgoing.map(({ id, toUid }) => (
                <li key={id} className="flex items-center justify-between gap-3">
                  <PersonLink uid={toUid} profile={people[toUid]}>
                    <span className="text-sm text-muted">Waiting for a reply</span>
                  </PersonLink>
                  <Button size="sm" variant="ghost" disabled={remove.isPending} onClick={() => remove.mutate(id)}>
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

function DashboardForMe() {
  const { profile } = useAuth()
  return profile && <Dashboard me={profile} />
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardForMe />
    </RequireAuth>
  )
}
