"use client"
import { Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useContacts } from "@/lib/queries"
import type { Contacts } from "@/lib/types"

const CONTACT_KEYS: readonly (keyof Contacts)[] = ["email", "phone", "links"]

interface ContactDetailsProps {
  uid: string
  /** Whether the viewer may see them (owner or accepted connection). */
  visible: boolean
  /** Whose details these are, for the locked message. */
  name: string
}

/** Someone's private contact details, or a lock notice when the viewer can't see them. */
export default function ContactDetails({ uid, visible, name }: ContactDetailsProps) {
  const t = useTranslations("Contacts")
  const contacts = useContacts(uid, visible)

  if (!visible) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 py-3 text-sm text-body">
        <Lock aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-muted" />
        {t("locked", { name })}
      </div>
    )
  }
  if (contacts.isError) return <p className="text-sm text-danger">{t("error")}</p>
  if (!contacts.data) return null

  const data = contacts.data
  const filled = CONTACT_KEYS.filter((key) => data[key])
  if (!filled.length) return <p className="text-sm text-muted">{t("none")}</p>
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {filled.map((key) => (
        <div key={key} className="flex flex-col gap-1 rounded-[14px] bg-brand-soft p-3.5">
          <dt className="text-xs text-brand-dark">{t(key)}</dt>
          <dd className="wrap-break-word text-[15px] font-bold">{data[key]}</dd>
        </div>
      ))}
    </dl>
  )
}
