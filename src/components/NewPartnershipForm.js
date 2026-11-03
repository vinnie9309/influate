"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPartnership } from "@/lib/data"
import { Button, ErrorNote, Field } from "./ui"

export default function NewPartnershipForm({ me, other, onCancel }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [code, setCode] = useState("")
  const [terms, setTerms] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const creator = me.role === "creator" ? me : other
  const brand = me.role === "brand" ? me : other

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const id = await createPartnership({ creatorUid: creator.uid, brandUid: brand.uid, createdBy: me.uid, title, code, terms })
      router.push(`/partnerships/${id}`)
    } catch {
      setError("Couldn't create the partnership. Please try again.")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="title" label="Campaign name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Spring collection" required />
        <Field
          id="code"
          label="Affiliate code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="MAYA10"
          pattern="[A-Za-z0-9_\-]{2,24}"
          title="2–24 letters, numbers, - or _"
          required
        />
      </div>
      <Field
        id="terms"
        label="Terms"
        value={terms}
        onChange={(e) => setTerms(e.target.value)}
        maxLength={200}
        placeholder="10% off for followers, 15% commission per sale"
      />
      <ErrorNote>{error}</ErrorNote>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          Start partnership
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
