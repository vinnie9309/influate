"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useAuth, useContacts } from "@/lib/queries"
import type { Contacts, Profile } from "@/lib/types"
import ChooseRoleForm from "@/components/ChooseRoleForm"
import ProfileForm from "@/components/ProfileForm"
import RequireAuth from "@/components/RequireAuth"
import { PageTitle, Spinner } from "@/components/ui"

const noContacts: Contacts = { email: "", phone: "", links: "" }

/** Waits for the private contact details so the form can start from them. */
function EditProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations("ProfileEdit")
  const router = useRouter()
  const params = useSearchParams()
  const contacts = useContacts(profile.uid)

  if (contacts.isPending) return <Spinner />
  return (
    <ProfileForm
      profile={profile}
      initialContacts={contacts.data ?? noContacts}
      onSaved={() => router.push(`/u/${profile.uid}`)}
      onCancel={() => router.back()}
      header={
        <PageTitle eyebrow={params.get("welcome") ? t("welcome") : t("yourProfile")} title={t("title")}>
          {profile.role === "brand" ? t("introBrand") : t("introCreator")}
        </PageTitle>
      }
    />
  )
}

function EditProfile() {
  const { user, profile } = useAuth()
  if (!user) return null
  return (
    <main className="mx-auto max-w-[820px] px-6 pb-24 pt-4">
      {profile ? <EditProfileForm key={profile.uid} profile={profile} /> : <ChooseRoleForm user={user} />}
    </main>
  )
}

export default function EditProfilePage() {
  return (
    <RequireAuth allowMissingProfile>
      <Suspense>
        <EditProfile />
      </Suspense>
    </RequireAuth>
  )
}
