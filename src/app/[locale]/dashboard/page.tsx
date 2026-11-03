"use client"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useCurrentMonth } from "@/lib/clock"
import { otherRole } from "@/lib/constants"
import { emptyTotals, sumResults } from "@/lib/data"
import { useMoney } from "@/lib/format"
import {
  useMyConnections,
  useMyPartnerships,
  useMyResults,
  useProfiles,
  useRemoveConnection,
  useRespondToConnection
} from "@/lib/queries"
import type { Partnership, PartnershipResult, Profile, Totals } from "@/lib/types"
import DataTable, { type Column } from "@/components/DataTable"
import PersonLink from "@/components/PersonLink"
import RequireProfile from "@/components/RequireProfile"
import SectionCard from "@/components/SectionCard"
import StatTile from "@/components/StatTile"
import { Button, PageTitle, Spinner, Tag } from "@/components/ui"

const groupByPartnership = (results: readonly PartnershipResult[]) =>
  results.reduce(
    (groups, r) => groups.set(r.partnershipId, [...(groups.get(r.partnershipId) ?? []), r]),
    new Map<string, PartnershipResult[]>()
  )

type PartnershipRow = Partnership & { partner: Profile | null | undefined; totals: Totals }

function Dashboard({ me }: { me: Profile }) {
  const t = useTranslations("Dashboard")
  const tStatus = useTranslations("Status")
  const tConnect = useTranslations("Connect")
  const money = useMoney()
  const month = useCurrentMonth()
  const connections = useMyConnections(me.uid)
  const partnerships = useMyPartnerships(me.uid)
  const results = useMyResults(me.uid)
  const respond = useRespondToConnection()
  const remove = useRemoveConnection()

  const otherUid = (participants: readonly string[]) => participants.find((p) => p !== me.uid) ?? ""
  const people = useProfiles([...(connections.data ?? []), ...(partnerships.data ?? [])].map((x) => otherUid(x.participants)))

  const isCreator = me.role === "creator"
  const valueKey = isCreator ? "earnings" : "revenue"
  const lookingFor = otherRole(me.role)

  const stats = useMemo(() => {
    if (!results.data) return null
    return {
      month: sumResults(results.data.filter((r) => r.date.startsWith(month)))[valueKey],
      total: sumResults(results.data)[valueKey],
      totalsById: new Map([...groupByPartnership(results.data)].map(([id, rows]) => [id, sumResults(rows)] as const))
    }
  }, [results.data, month, valueKey])

  const partnershipColumns: readonly Column<PartnershipRow>[] = [
    { header: t("partner"), cell: (p) => p.partner?.displayName ?? "…", className: "font-semibold" },
    {
      header: t("campaign"),
      cell: (p) => (
        <Link href={`/partnerships/${p.id}`} className="font-semibold">
          {p.title}
        </Link>
      )
    },
    { header: t("code"), cell: (p) => p.code, className: "font-mono" },
    { header: t("sales"), cell: (p) => p.totals.sales },
    { header: t("revenue"), cell: (p) => money(p.totals.revenue) },
    { header: t("creatorEarnings"), cell: (p) => money(p.totals.earnings) },
    { header: t("status"), cell: (p) => <Tag tone={p.status === "active" ? "brand" : "mist"}>{tStatus("label", { status: p.status })}</Tag> }
  ]

  if (!connections.data || !partnerships.data || !stats) return <Spinner />

  const incoming = connections.data.filter((c) => c.status === "pending" && c.toUid === me.uid)
  const outgoing = connections.data.filter((c) => c.status === "pending" && c.fromUid === me.uid)
  const accepted = connections.data.filter((c) => c.status === "accepted")
  const greeting = isCreator ? me.displayName.split(" ")[0] : me.displayName
  const partnershipRows: PartnershipRow[] = partnerships.data
    .toSorted((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    .map((p) => ({ ...p, partner: people[otherUid(p.participants)], totals: stats.totalsById.get(p.id) ?? emptyTotals() }))

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-24 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow={t("eyebrow")} title={t("greeting", { name: greeting ?? "" })} />
        <Button href="/discover">{t("find", { role: lookingFor })}</Button>
      </div>

      {!me.categories.length && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-sun-soft p-5">
          <p className="text-[15px] font-medium text-sun-ink">{t("completeNotice", { role: lookingFor })}</p>
          <Button href="/profile/edit" variant="dark" size="sm">
            {t("completeButton")}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile label={t("activePartnerships")} value={partnerships.data.filter((p) => p.status === "active").length} />
        <StatTile label={t("valueMonth", { role: me.role })} value={money(stats.month)} />
        <StatTile label={t("valueTotal", { role: me.role })} value={money(stats.total)} />
        <StatTile label={t("requestsWaiting")} value={incoming.length} />
      </div>

      {incoming.length > 0 && (
        <SectionCard title={t("connectRequests")}>
          <ul className="flex flex-col divide-y divide-line">
            {incoming.map(({ id, fromUid, note }) => (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <PersonLink uid={fromUid} profile={people[fromUid]}>
                  {note && <span className="line-clamp-1 text-sm text-muted">“{note}”</span>}
                </PersonLink>
                <div className="flex gap-2">
                  <Button size="sm" disabled={respond.isPending} onClick={() => respond.mutate({ id, status: "accepted" })}>
                    {tConnect("accept")}
                  </Button>
                  <Button size="sm" variant="outline" disabled={respond.isPending} onClick={() => respond.mutate({ id, status: "declined" })}>
                    {tConnect("decline")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title={t("partnerships")}>
        {partnershipRows.length ? (
          <DataTable columns={partnershipColumns} rows={partnershipRows} rowKey={(p) => p.id} minWidth={640} />
        ) : (
          <p className="text-[15px] text-muted">{t("noPartnerships", { role: lookingFor })}</p>
        )}
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title={t("connections")}>
          {accepted.length ? (
            <ul className="flex flex-col gap-3">
              {accepted.map(({ id, participants }) => {
                const uid = otherUid(participants)
                return (
                  <li key={id}>
                    <PersonLink uid={uid} profile={people[uid]}>
                      <span className="truncate text-sm text-muted">{people[uid]?.headline || t("connected")}</span>
                    </PersonLink>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-[15px] text-muted">{t("noConnections")}</p>
          )}
        </SectionCard>
        <SectionCard title={t("sentRequests")}>
          {outgoing.length ? (
            <ul className="flex flex-col gap-3">
              {outgoing.map(({ id, toUid }) => (
                <li key={id} className="flex items-center justify-between gap-3">
                  <PersonLink uid={toUid} profile={people[toUid]}>
                    <span className="text-sm text-muted">{t("waiting")}</span>
                  </PersonLink>
                  <Button size="sm" variant="ghost" disabled={remove.isPending} onClick={() => remove.mutate(id)}>
                    {tConnect("withdraw")}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-muted">{t("nothingPending")}</p>
          )}
        </SectionCard>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return <RequireProfile>{(me) => <Dashboard me={me} />}</RequireProfile>
}
