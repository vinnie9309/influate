"use client"
import { useState, type FormEvent } from "react"
import type { User } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"
import { useCreateProfile } from "@/lib/queries"
import type { Role } from "@/lib/types"
import RolePicker from "./RolePicker"
import { Button, Card, ErrorNote, Field, PageTitle } from "./ui"

/** The name Google (or another provider) gave us, if any. */
const providerName = (user: User): string => {
  const { full_name, name } = user.user_metadata as { full_name?: string; name?: string }
  return full_name ?? name ?? ""
}

/** Creates the profile for a signed-in user who doesn't have one yet (e.g. after Google sign-in). */
export default function ChooseRoleForm({ user }: { user: User }) {
  const t = useTranslations("ChooseRole")
  const tAuth = useTranslations("Auth")
  const createProfile = useCreateProfile()
  const [role, setRole] = useState<Role>("creator")
  const [name, setName] = useState(() => providerName(user))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createProfile.mutate({ role, displayName: name.trim() })
  }

  return (
    <Card className="mx-auto flex max-w-[480px] flex-col gap-6 p-8 shadow-float">
      <PageTitle title={t("title")}>{t("text")}</PageTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <RolePicker value={role} onChange={setRole} />
        <Field
          id="name"
          label={role === "brand" ? tAuth("companyName") : tAuth("yourName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
        <ErrorNote>{createProfile.isError && t("error")}</ErrorNote>
        <Button type="submit" size="lg" disabled={createProfile.isPending}>
          {t("continue")}
        </Button>
      </form>
    </Card>
  )
}
