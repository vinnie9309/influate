"use client"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { useToday } from "@/lib/clock"
import { useAddResult } from "@/lib/queries"
import type { Partnership, ResultInput } from "@/lib/types"
import { Button, ErrorNote, Field } from "./ui"

const emptyResult = (date: string): ResultInput => ({ date, sales: "", revenue: "", earnings: "", note: "" })

/** Logs sales, revenue and creator earnings for a partnership. */
export default function AddResultForm({ partnership, uid }: { partnership: Partnership; uid: string }) {
  const t = useTranslations("ResultForm")
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
        <Field id="date" type="date" label={t("date")} value={form.date} onChange={set("date")} max={today} required />
        <Field id="sales" type="number" label={t("sales")} min="0" step="1" value={form.sales} onChange={set("sales")} required />
        <Field id="revenue" type="number" label={t("revenue")} min="0" step="0.01" value={form.revenue} onChange={set("revenue")} required />
        <Field id="earnings" type="number" label={t("earnings")} min="0" step="0.01" value={form.earnings} onChange={set("earnings")} required />
      </div>
      <Field id="resultNote" label={t("note")} value={form.note} onChange={set("note")} maxLength={140} placeholder={t("notePlaceholder")} />
      <ErrorNote>{addResult.isError && t("error")}</ErrorNote>
      <Button type="submit" className="self-start" disabled={addResult.isPending}>
        {t("add")}
      </Button>
    </form>
  )
}
