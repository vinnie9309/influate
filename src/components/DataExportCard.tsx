"use client"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { useToday } from "@/lib/clock"
import { downloadJson } from "@/lib/download"
import { useExportMyData } from "@/lib/queries"
import SectionCard from "./SectionCard"
import { Button, ErrorNote } from "./ui"

/** Downloads everything stored about the signed-in user as JSON (GDPR access and portability). */
export default function DataExportCard() {
  const t = useTranslations("Account")
  const today = useToday()
  const exportData = useExportMyData()

  const handleExport = () =>
    exportData.mutate(undefined, { onSuccess: (data) => downloadJson(data, `influate-data-${today}.json`) })

  return (
    <SectionCard title={t("exportTitle")} description={t("exportText")}>
      <ErrorNote>{exportData.isError && t("exportError")}</ErrorNote>
      <Button variant="outline" className="self-start" disabled={exportData.isPending} onClick={handleExport}>
        <Download aria-hidden="true" className="h-4 w-4" />
        {exportData.isPending ? t("exporting") : t("exportButton")}
      </Button>
    </SectionCard>
  )
}
