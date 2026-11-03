"use client"
import { useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { useRemoveConnection, useRequestConnection, useRespondToConnection } from "@/lib/queries"
import type { Connection, Profile } from "@/lib/types"
import { Button, ErrorNote, TextAreaField } from "./ui"

interface ConnectPanelProps {
  me: Profile
  other: Profile
  connection: Connection | null
}

// The request/accept controls on someone else's profile.
export default function ConnectPanel({ me, other, connection }: ConnectPanelProps) {
  const t = useTranslations("Connect")
  const tCommon = useTranslations("Common")
  const [composing, setComposing] = useState(false)
  const [note, setNote] = useState("")
  const request = useRequestConnection()
  const respond = useRespondToConnection()
  const remove = useRemoveConnection()

  const busy = request.isPending || respond.isPending || remove.isPending
  const error = request.isError || respond.isError || remove.isError ? tCommon("genericError") : ""

  if (me.role === other.role) return <p className="text-sm text-muted">{t("sameRole", { role: me.role })}</p>

  if (!connection) {
    if (!composing) return <Button onClick={() => setComposing(true)}>{t("request")}</Button>

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      request.mutate({ fromUid: me.uid, toUid: other.uid, note }, { onSuccess: () => setComposing(false) })
    }

    return (
      <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
        <TextAreaField
          id="note"
          label={t("noteLabel", { name: other.displayName })}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={400}
          placeholder={t("notePlaceholder")}
        />
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>
            {t("send")}
          </Button>
          <Button variant="ghost" onClick={() => setComposing(false)}>
            {tCommon("cancel")}
          </Button>
        </div>
      </form>
    )
  }

  const { id, status, toUid, note: requestNote } = connection

  if (status === "pending" && toUid === me.uid) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="text-sm font-semibold text-subtle">{t("wantsToConnect", { name: other.displayName })}</p>
        {requestNote && <blockquote className="rounded-xl bg-mist px-4 py-3 text-[15px] text-body">{requestNote}</blockquote>}
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-2">
          <Button disabled={busy} onClick={() => respond.mutate({ id, status: "accepted" })}>
            {t("accept")}
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => respond.mutate({ id, status: "declined" })}>
            {t("decline")}
          </Button>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-subtle">{t("requestSent")}</span>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => remove.mutate(id)}>
          {t("withdraw")}
        </Button>
      </div>
    )
  }

  if (status === "accepted") {
    return <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-[15px] font-bold text-brand-dark">{t("connected")}</span>
  }

  return <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-muted">{t("notAvailable")}</span>
}
