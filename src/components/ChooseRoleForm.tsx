"use client"
import { useState, type FormEvent } from "react"
import type { User } from "firebase/auth"
import { useCreateProfile } from "@/lib/queries"
import type { Role } from "@/lib/types"
import RolePicker from "./RolePicker"
import { Button, Card, ErrorNote, Field, PageTitle } from "./ui"

/** Creates the profile for a signed-in user who doesn't have one yet (e.g. after Google sign-in). */
export default function ChooseRoleForm({ user }: { user: User }) {
  const createProfile = useCreateProfile()
  const [role, setRole] = useState<Role>("creator")
  const [name, setName] = useState(user.displayName ?? "")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createProfile.mutate({ uid: user.uid, role, displayName: name.trim(), email: user.email })
  }

  return (
    <Card className="mx-auto flex max-w-[480px] flex-col gap-6 p-8 shadow-float">
      <PageTitle title="One more step">Tell us which side of Influate you&apos;re on.</PageTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <RolePicker value={role} onChange={setRole} />
        <Field
          id="name"
          label={role === "brand" ? "Company name" : "Your name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <ErrorNote>{createProfile.isError && "Couldn't save. Please try again."}</ErrorNote>
        <Button type="submit" size="lg" disabled={createProfile.isPending}>
          Continue
        </Button>
      </form>
    </Card>
  )
}
