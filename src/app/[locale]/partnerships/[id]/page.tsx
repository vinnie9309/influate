"use client"
import { useParams } from "next/navigation"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { sumResults } from "@/lib/data"
import { useMoney } from "@/lib/format"
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
  const t = useTranslations("Partnership")
  const tRoles = useTranslations("Roles")
  const tStatus = useTranslations("Status")
  const tCommon = useTranslations("Common")
  const money = useMoney()
  // Undefined when the partner deleted their account.
  const otherUid = partnership.participants.find((p) => p !== me.uid)
  const { data: partner } = useProfile(otherUid)
  const { data: results = [] } = usePartnershipResults(partnership)
  const setStatus = useSetPartnershipStatus()
  const deleteResult = useDeleteResult()

  const totals = sumResults(results)
  const history = results.toSorted((a, b) => b.date.localeCompare(a.date))
  const active = partnership.status === "active"

  const historyColumns: readonly Column<PartnershipResult>[] = [
    { header: t("date"), cell: (r) => r.date, className: "font-semibold" },
    { header: t("sales"), cell: (r) => r.sales },
    { header: t("revenue"), cell: (r) => money(r.revenue) },
    { header: t("earnings"), cell: (r) => money(r.earnings) },
    { header: t("note"), cell: (r) => r.note, className: "text-muted" },
    {
      header: "",
      className: "text-right",
      cell: (r) =>
        r.createdBy === me.uid && (
          <button
            type="button"
            aria-label={t("deleteResult", { date: r.date })}
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
        {t("back")}
      </Link>
      <Card className="flex flex-col gap-5 p-6 shadow-float sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">{partnership.title}</h1>
              <Tag tone={active ? "brand" : "mist"}>{tStatus("label", { status: partnership.status })}</Tag>
            </div>
            {otherUid ? (
              <PersonLink uid={otherUid} profile={partner} size={36}>
                {partner && <span className="text-sm text-muted">{tRoles("label", { role: partner.role })}</span>}
              </PersonLink>
            ) : (
              <span className="text-[15px] font-semibold text-muted">{tCommon("deletedAccount")}</span>
            )}
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
              {active ? t("end") : t("reactivate")}
            </Button>
          </div>
        </div>
        {partnership.terms && <p className="rounded-xl bg-paper px-4 py-3 text-[15px] text-body">{partnership.terms}</p>}
        <div className="grid grid-cols-3 gap-3">
          <StatTile variant="subtle" label={t("sales")} value={totals.sales} />
          <StatTile variant="subtle" label={t("revenue")} value={money(totals.revenue)} />
          <StatTile variant="subtle" label={t("creatorEarnings")} value={money(totals.earnings)} />
        </div>
      </Card>

      {active && (
        <SectionCard title={t("logTitle")} description={t("logText", { code: partnership.code })}>
          <AddResultForm partnership={partnership} uid={me.uid} />
        </SectionCard>
      )}

      <SectionCard title={t("history")}>
        {history.length ? (
          <DataTable columns={historyColumns} rows={history} rowKey={(r) => r.id} />
        ) : (
          <p className="text-[15px] text-muted">{t("noResults")}</p>
        )}
      </SectionCard>
    </main>
  )
}

function PartnershipPage({ me }: { me: Profile }) {
  const t = useTranslations("Partnership")
  const { id } = useParams<{ id: string }>()
  // The database returns nothing unless the viewer is part of it: shown as not found.
  const { data: partnership, isPending } = usePartnership(id)

  if (isPending) return <Spinner />
  if (!partnership) return <PageMessage title={t("notFoundTitle")}>{t("notFoundText")}</PageMessage>
  return <PartnershipView partnership={partnership} me={me} />
}

export default function PartnershipRoute() {
  return <RequireProfile>{(me) => <PartnershipPage me={me} />}</RequireProfile>
}
