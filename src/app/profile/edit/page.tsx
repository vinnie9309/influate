"use client"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth, useContacts } from "@/lib/queries"
import type { Contacts, Profile } from "@/lib/types"
import ChooseRoleForm from "@/components/ChooseRoleForm"
import ProfileForm from "@/components/ProfileForm"
import RequireAuth from "@/components/RequireAuth"
import { PageTitle, Spinner } from "@/components/ui"

const noContacts: Contacts = { email: "", phone: "", links: "" }

/** Waits for the private contact details so the form can start from them. */
function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const params = useSearchParams()
  const contacts = useContacts(profile.uid)
  const isBrand = profile.role === "brand"

  if (contacts.isPending) return <Spinner />
  return (
    <ProfileForm
      profile={profile}
      initialContacts={contacts.data ?? noContacts}
      onSaved={() => router.push(`/u/${profile.uid}`)}
      onCancel={() => router.back()}
      header={
        <PageTitle eyebrow={params.get("welcome") ? "Welcome to Influate" : "Your profile"} title="Edit profile">
          {isBrand
            ? "Tell creators what you sell and who you want to reach. Everything except your contact details is public."
            : "Show brands what you create and who follows you. Everything except your contact details is public."}
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
