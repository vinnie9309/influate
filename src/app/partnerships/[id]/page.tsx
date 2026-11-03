"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Trash2 } from "lucide-react"
import { ROLES, formatMoney } from "@/lib/constants"
import { sumResults } from "@/lib/data"
import { useDeleteResult, usePartnership, usePartnershipResults, useProfile, useSetPartnershipStatus } from "@/lib/queries"
import type { Partnership, PartnershipResult, Profile } from "@/lib/types"
import AddResultForm from "@/components/AddResultForm"
import DataTable, { type Column } from "@/components/DataTable"
import PageMessage from "@/components/PageMessage"
import PersonLink from "@/components/PersonLink"
import RequireProfile from "@/components/RequireProfile"
import SectionCard from "@/components/SectionCard"
import StatTile from "@/components/StatTile"
import { Button, Card, Spinner, Tag } from "@/components/ui"

function PartnershipView({ partnership, me }: { partnership: Partnership; me: Profile }) {
  const otherUid = partnership.participants.find((p) => p !== me.uid) ?? ""
  const { data: partner } = useProfile(otherUid)
  const { data: results = [] } = usePartnershipResults(partnership, me.uid)
  const setStatus = useSetPartnershipStatus()
  const deleteResult = useDeleteResult()

  const totals = sumResults(results)
  const history = results.toSorted((a, b) => b.date.localeCompare(a.date))
  const active = partnership.status === "active"

  const historyColumns: readonly Column<PartnershipResult>[] = [
    { header: "Date", cell: (r) => r.date, className: "font-semibold" },
    { header: "Sales", cell: (r) => r.sales },
    { header: "Revenue", cell: (r) => formatMoney(r.revenue) },
    { header: "Earnings", cell: (r) => formatMoney(r.earnings) },
    { header: "Note", cell: (r) => r.note, className: "text-muted" },
    {
      header: "",
      className: "text-right",
      cell: (r) =>
        r.createdBy === me.uid && (
          <button
            type="button"
            aria-label={`Delete result from ${r.date}`}
            disabled={deleteResult.isPending}
            onClick={() => deleteResult.mutate(r.id)}
            className="rounded-lg p-2 text-muted hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )
    }
  ]

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-6 pb-24 pt-4">
      <Link href="/dashboard" className="self-start text-sm font-semibold">
        ← Dashboard
      </Link>
      <Card className="flex flex-col gap-5 p-6 shadow-float sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">{partnership.title}</h1>
              <Tag tone={active ? "brand" : "mist"}>{active ? "Active" : "Ended"}</Tag>
            </div>
            <PersonLink uid={otherUid} profile={partner} size={36}>
              {partner && <span className="text-sm text-muted">{ROLES[partner.role].label}</span>}
            </PersonLink>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-sun bg-sun-soft px-4 py-1.5 font-mono text-base font-bold text-sun-ink">
              {partnership.code}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={setStatus.isPending}
              onClick={() => setStatus.mutate({ id: partnership.id, status: active ? "ended" : "active" })}
            >
              {active ? "End partnership" : "Reactivate"}
            </Button>
          </div>
        </div>
        {partnership.terms && <p className="rounded-xl bg-paper px-4 py-3 text-[15px] text-body">{partnership.terms}</p>}
        <div className="grid grid-cols-3 gap-3">
          <StatTile variant="subtle" label="Sales" value={totals.sales} />
          <StatTile variant="subtle" label="Revenue" value={formatMoney(totals.revenue)} />
          <StatTile variant="subtle" label="Creator earnings" value={formatMoney(totals.earnings)} />
        </div>
      </Card>

      {active && (
        <SectionCard
          title="Log results"
          description={`Enter sales made with ${partnership.code}, for example from your shop's discount report. Both sides see every entry.`}
        >
          <AddResultForm partnership={partnership} uid={me.uid} />
        </SectionCard>
      )}

      <SectionCard title="History">
        {history.length ? (
          <DataTable columns={historyColumns} rows={history} rowKey={(r) => r.id} />
        ) : (
          <p className="text-[15px] text-muted">No results logged yet.</p>
        )}
      </SectionCard>
    </main>
  )
}

function PartnershipPage({ me }: { me: Profile }) {
  const { id } = useParams<{ id: string }>()
  // A denied read means it isn't the viewer's partnership: shown as not found.
  const { data: partnership, isPending } = usePartnership(id)

  if (isPending) return <Spinner />
  if (!partnership) return <PageMessage title="Partnership not found">It doesn&apos;t exist, or you&apos;re not part of it.</PageMessage>
  return <PartnershipView partnership={partnership} me={me} />
}

export default function PartnershipRoute() {
  return <RequireProfile>{(me) => <PartnershipPage me={me} />}</RequireProfile>
}
