"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { signOut } from "@/lib/data"
import { useDeleteMyAccount } from "@/lib/queries"
import SectionCard from "./SectionCard"
import { Button, ErrorNote } from "./ui"

/** Permanently deletes the signed-in user's account after an explicit confirmation. */
export default function DeleteAccountCard() {
  const t = useTranslations("Account")
  const router = useRouter()
  const deleteAccount = useDeleteMyAccount()
  const [confirmed, setConfirmed] = useState(false)

  // Leave the signed-in area first, then drop the session that belonged to the deleted account.
  const handleDelete = () =>
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        router.replace("/")
        void signOut({ scope: "local" })
      }
    })

  return (
    <SectionCard title={t("deleteTitle")} description={t("deleteText")} className="border-danger/30">
      <label className="flex items-start gap-3 text-[15px] text-body">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 accent-danger"
        />
        {t("deleteConfirm")}
      </label>
      <ErrorNote>{deleteAccount.isError && t("deleteError")}</ErrorNote>
      <Button variant="danger" className="self-start" disabled={!confirmed || deleteAccount.isPending} onClick={handleDelete}>
        {deleteAccount.isPending ? t("deleting") : t("deleteButton")}
      </Button>
    </SectionCard>
  )
}
