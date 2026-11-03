"use client"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useToday } from "@/lib/clock"
import { useAddResult } from "@/lib/queries"
import type { Partnership, ResultInput } from "@/lib/types"
import { Button, ErrorNote, Field } from "./ui"

const emptyResult = (date: string): ResultInput => ({ date, sales: "", revenue: "", earnings: "", note: "" })

/** Logs sales, revenue and creator earnings for a partnership. */
export default function AddResultForm({ partnership, uid }: { partnership: Partnership; uid: string }) {
  const today = useToday()
  const addResult = useAddResult()
  const [form, setForm] = useState<ResultInput>(() => emptyResult(today))
  const set = (key: keyof ResultInput) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addResult.mutate({ partnership, createdBy: uid, input: form }, { onSuccess: () => setForm(emptyResult(today)) })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <Field id="date" type="date" label="Date" value={form.date} onChange={set("date")} max={today} required />
        <Field id="sales" type="number" label="Sales" min="0" step="1" value={form.sales} onChange={set("sales")} required />
        <Field id="revenue" type="number" label="Revenue (€)" min="0" step="0.01" value={form.revenue} onChange={set("revenue")} required />
        <Field id="earnings" type="number" label="Creator earnings (€)" min="0" step="0.01" value={form.earnings} onChange={set("earnings")} required />
      </div>
      <Field id="resultNote" label="Note" value={form.note} onChange={set("note")} maxLength={140} placeholder="Weekly report from the shop" />
      <ErrorNote>{addResult.isError && "Couldn't save the result. Please try again."}</ErrorNote>
      <Button type="submit" className="self-start" disabled={addResult.isPending}>
        Add result
      </Button>
    </form>
  )
}
