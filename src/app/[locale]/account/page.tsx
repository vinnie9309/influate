"use client"
import { useTranslations } from "next-intl"
import DataExportCard from "@/components/DataExportCard"
import DeleteAccountCard from "@/components/DeleteAccountCard"
import RequireAuth from "@/components/RequireAuth"
import { PageTitle } from "@/components/ui"

function Account() {
  const t = useTranslations("Account")
  return (
    <main className="mx-auto flex max-w-[820px] flex-col gap-5 px-6 pb-24 pt-4">
      <PageTitle eyebrow={t("eyebrow")} title={t("title")}>
        {t("intro")}
      </PageTitle>
      <DataExportCard />
      <DeleteAccountCard />
    </main>
  )
}

// Available before a profile exists, so anyone who signed up can still export or delete.
export default function AccountPage() {
  return (
    <RequireAuth allowMissingProfile>
      <Account />
    </RequireAuth>
  )
}
