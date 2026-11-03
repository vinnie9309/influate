"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useCreatePartnership } from "@/lib/queries"
import type { Profile } from "@/lib/types"
import { Button, ErrorNote, Field } from "./ui"

interface NewPartnershipFormProps {
  me: Profile
  other: Profile
  onCancel?: () => void
}

export default function NewPartnershipForm({ me, other, onCancel }: NewPartnershipFormProps) {
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
      <ErrorNote>{createPartnership.isError && "Couldn't create the partnership. Please try again."}</ErrorNote>
      <div className="flex gap-2">
        <Button type="submit" disabled={createPartnership.isPending}>
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
