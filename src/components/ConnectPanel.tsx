"use client"
import { useState, type FormEvent } from "react"
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
  const [composing, setComposing] = useState(false)
  const [note, setNote] = useState("")
  const request = useRequestConnection()
  const respond = useRespondToConnection()
  const remove = useRemoveConnection()

  const busy = request.isPending || respond.isPending || remove.isPending
  const failed = request.isError || respond.isError || remove.isError
  const error = failed ? "That didn't work. Please try again." : ""

  if (me.role === other.role) {
    return (
      <p className="text-sm text-muted">
        Connections are between creators and brands, so you can&apos;t connect with another {me.role}.
      </p>
    )
  }

  if (!connection) {
    if (!composing) return <Button onClick={() => setComposing(true)}>Request to connect</Button>

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      request.mutate({ fromUid: me.uid, toUid: other.uid, note }, { onSuccess: () => setComposing(false) })
    }

    return (
      <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
        <TextAreaField
          id="note"
          label={`Note to ${other.displayName}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={400}
          placeholder="Say who you are and what kind of partnership you have in mind."
        />
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>
            Send request
          </Button>
          <Button variant="ghost" onClick={() => setComposing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  const { id, status, toUid, note: requestNote } = connection

  if (status === "pending" && toUid === me.uid) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="text-sm font-semibold text-subtle">{other.displayName} wants to connect with you.</p>
        {requestNote && <blockquote className="rounded-xl bg-mist px-4 py-3 text-[15px] text-body">{requestNote}</blockquote>}
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-2">
          <Button disabled={busy} onClick={() => respond.mutate({ id, status: "accepted" })}>
            Accept
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => respond.mutate({ id, status: "declined" })}>
            Decline
          </Button>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-subtle">Request sent</span>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => remove.mutate(id)}>
          Withdraw
        </Button>
      </div>
    )
  }

  if (status === "accepted") {
    return <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-[15px] font-bold text-brand-dark">Connected</span>
  }

  return <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-muted">Not available</span>
}
