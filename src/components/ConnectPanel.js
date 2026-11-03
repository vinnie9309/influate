"use client"
import { useState } from "react"
import { removeConnection, requestConnection, respondToConnection } from "@/lib/data"
import { Button, ErrorNote, Field } from "./ui"

// The request/accept controls on someone else's profile.
export default function ConnectPanel({ me, other, connection }) {
  const [composing, setComposing] = useState(false)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const act = async (fn) => {
    setError("")
    setBusy(true)
    try {
      await fn()
      setComposing(false)
    } catch {
      setError("That didn't work. Please try again.")
    }
    setBusy(false)
  }

  if (me.role === other.role) {
    return (
      <p className="text-sm text-muted">
        Connections are between creators and brands, so you can&apos;t connect with another {me.role}.
      </p>
    )
  }

  if (!connection) {
    if (!composing) return <Button onClick={() => setComposing(true)}>Request to connect</Button>
    return (
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          act(() => requestConnection(me.uid, other.uid, note))
        }}
      >
        <Field
          id="note"
          as="textarea"
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

  const incoming = connection.toUid === me.uid

  if (connection.status === "pending" && incoming) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className="text-sm font-semibold text-subtle">{other.displayName} wants to connect with you.</p>
        {connection.note && <blockquote className="rounded-xl bg-mist px-4 py-3 text-[15px] text-body">{connection.note}</blockquote>}
        <ErrorNote>{error}</ErrorNote>
        <div className="flex gap-2">
          <Button disabled={busy} onClick={() => act(() => respondToConnection(connection.id, "accepted"))}>
            Accept
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => act(() => respondToConnection(connection.id, "declined"))}>
            Decline
          </Button>
        </div>
      </div>
    )
  }

  if (connection.status === "pending") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-subtle">Request sent</span>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => act(() => removeConnection(connection.id))}>
          Withdraw
        </Button>
      </div>
    )
  }

  if (connection.status === "accepted") {
    return <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-[15px] font-bold text-brand-dark">Connected</span>
  }

  return <span className="rounded-xl bg-mist px-4 py-2.5 text-[15px] font-bold text-muted">Not available</span>
}
