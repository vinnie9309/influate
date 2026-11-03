"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { formatMoney } from "@/lib/constants"
import {
  addResult,
  deleteResult,
  setPartnershipStatus,
  sumResults,
  watchPartnership,
  watchPartnershipResults
} from "@/lib/data"
import useProfiles from "@/lib/useProfiles"
import RequireAuth from "@/components/RequireAuth"
import { Avatar, Button, Card, ErrorNote, Field, PageTitle, Spinner, Tag } from "@/components/ui"

const today = () => new Date().toISOString().slice(0, 10)

function AddResultForm({ partnership, uid }) {
  const empty = { date: today(), sales: "", revenue: "", earnings: "", note: "" }
  const [form, setForm] = useState(empty)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await addResult(partnership, uid, form)
      setForm(empty)
    } catch {
      setError("Couldn't save the result. Please try again.")
    }
    setBusy(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field id="date" type="date" label="Date" value={form.date} onChange={set("date")} max={today()} required />
        <Field id="sales" type="number" label="Sales" min="0" step="1" value={form.sales} onChange={set("sales")} required />
        <Field id="revenue" type="number" label="Revenue (€)" min="0" step="0.01" value={form.revenue} onChange={set("revenue")} required />
        <Field id="earnings" type="number" label="Creator earnings (€)" min="0" step="0.01" value={form.earnings} onChange={set("earnings")} required />
      </div>
      <Field id="resultNote" label="Note" value={form.note} onChange={set("note")} maxLength={140} placeholder="Weekly report from the shop" />
      <ErrorNote>{error}</ErrorNote>
      <Button type="submit" className="self-start" disabled={busy}>
        Add result
      </Button>
    </form>
  )
}

function Partnership() {
  const { id } = useParams()
  const { profile: me } = useAuth()
  const [partnership, setPartnership] = useState(undefined)
  const [results, setResults] = useState([])

  // A denied read means it isn't the viewer's partnership: treat it as not found.
  useEffect(() => watchPartnership(id, setPartnership, () => setPartnership(null)), [id])
  useEffect(() => {
    if (partnership) return watchPartnershipResults(partnership, me.uid, setResults)
    // Re-subscribe only when the partnership itself changes, not on status edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnership?.id, me.uid])

  const otherUid = partnership?.participants.find((p) => p !== me.uid)
  const people = useProfiles(otherUid ? [otherUid] : [])

  if (partnership === undefined) return <Spinner />
  if (!partnership) {
    return (
      <main className="mx-auto max-w-[960px] px-6 pb-24 pt-4">
        <PageTitle title="Partnership not found">It doesn&apos;t exist, or you&apos;re not part of it.</PageTitle>
      </main>
    )
  }

  const partner = people[otherUid]
  const totals = sumResults(results)
  const sorted = [...results].sort((a, b) => b.date.localeCompare(a.date))
  const active = partnership.status === "active"

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-6 pb-24 pt-4">
      <Link href="/dashboard" className="self-start text-sm font-semibold">
        ← Dashboard
      </Link>
      <Card className="flex flex-col gap-5 p-6 shadow-float sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">{partnership.title}</h1>
              <Tag tone={active ? "brand" : "mist"}>{active ? "Active" : "Ended"}</Tag>
            </div>
            <Link href={`/u/${otherUid}`} className="flex items-center gap-2.5 text-ink hover:text-brand">
              <Avatar name={partner?.displayName} role={partner?.role} size={32} />
              <span className="text-[15px] font-semibold">with {partner?.displayName ?? "…"}</span>
            </Link>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-sun bg-sun-soft px-4 py-1.5 font-mono text-base font-bold text-sun-ink">
              {partnership.code}
            </span>
            <Button size="sm" variant="ghost" onClick={() => setPartnershipStatus(partnership.id, active ? "ended" : "active")}>
              {active ? "End partnership" : "Reactivate"}
            </Button>
          </div>
        </div>
        {partnership.terms && <p className="rounded-xl bg-paper px-4 py-3 text-[15px] text-body">{partnership.terms}</p>}
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Sales", totals.sales],
            ["Revenue", formatMoney(totals.revenue)],
            ["Creator earnings", formatMoney(totals.earnings)]
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 rounded-2xl bg-paper p-4">
              <span className="text-[13px] text-muted">{label}</span>
              <strong className="text-2xl font-extrabold tracking-[-0.02em]">{value}</strong>
            </div>
          ))}
        </div>
      </Card>

      {active && (
        <Card className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">Log results</h2>
            <p className="text-sm text-muted">
              Enter sales made with {partnership.code}, for example from your shop&apos;s discount report. Both sides see
              every entry.
            </p>
          </div>
          <AddResultForm partnership={partnership} uid={me.uid} />
        </Card>
      )}

      <Card className="flex flex-col gap-4 p-6 sm:p-8">
        <h2 className="text-lg font-bold">History</h2>
        {sorted.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-muted">
                  {["Date", "Sales", "Revenue", "Earnings", "Note", ""].map((h) => (
                    <th key={h} scope="col" className="border-b border-line px-2 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id} className="border-b border-mist last:border-0">
                    <td className="px-2 py-3 font-semibold">{r.date}</td>
                    <td className="px-2 py-3">{r.sales}</td>
                    <td className="px-2 py-3">{formatMoney(r.revenue)}</td>
                    <td className="px-2 py-3">{formatMoney(r.earnings)}</td>
                    <td className="px-2 py-3 text-muted">{r.note}</td>
                    <td className="px-2 py-3 text-right">
                      {r.createdBy === me.uid && (
                        <button
                          type="button"
                          aria-label={`Delete result from ${r.date}`}
                          onClick={() => deleteResult(r.id)}
                          className="rounded-lg p-2 text-muted hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[15px] text-muted">No results logged yet.</p>
        )}
      </Card>
    </main>
  )
}

export default function PartnershipPage() {
  return (
    <RequireAuth>
      <Partnership />
    </RequireAuth>
  )
}
