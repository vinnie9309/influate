"use client"
import { useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useCreatePartnership } from "@/lib/queries"
import type { Profile } from "@/lib/types"
import { Button, ErrorNote, Field } from "./ui"

interface NewPartnershipFormProps {
  me: Profile
  other: Profile
  onCancel?: () => void
}

export default function NewPartnershipForm({ me, other, onCancel }: NewPartnershipFormProps) {
  const t = useTranslations("NewPartnership")
  const tCommon = useTranslations("Common")
  const router = useRouter()
  const createPartnership = useCreatePartnership()
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("")
  const [terms, setTerms] = useState("")

  const [creator, brand] = me.role === "creator" ? [me, other] : [other, me]

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createPartnership.mutate(
      { creatorUid: creator.uid, brandUid: brand.uid, createdBy: me.uid, title, code, terms },
      { onSuccess: (id) => router.push(`/partnerships/${id}`) }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="title" label={t("campaign")} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("campaignPlaceholder")} required />
        <Field
          id="code"
          label={t("code")}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="MAYA10"
          pattern="[A-Za-z0-9_\-]{2,24}"
          title={t("codeTitle")}
          required
        />
      </div>
      <Field id="terms" label={t("terms")} value={terms} onChange={(e) => setTerms(e.target.value)} maxLength={200} placeholder={t("termsPlaceholder")} />
      <ErrorNote>{createPartnership.isError && t("error")}</ErrorNote>
      <div className="flex gap-2">
        <Button type="submit" disabled={createPartnership.isPending}>
          {t("start")}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            {tCommon("cancel")}
          </Button>
        )}
      </div>
    </form>
  )
}
