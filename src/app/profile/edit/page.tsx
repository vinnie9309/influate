"use client"
import { Suspense, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User } from "firebase/auth"
import { AUDIENCE_AGES, CATEGORIES, FOLLOWER_RANGES, PLATFORMS } from "@/lib/constants"
import { useAuth, useContacts, useCreateProfile, useSaveProfile } from "@/lib/queries"
import type { Contacts, Profile, ProfileFields, Role } from "@/lib/types"
import RequireAuth from "@/components/RequireAuth"
import RolePicker from "@/components/RolePicker"
import { Button, Card, ChipToggle, ErrorNote, Field, PageTitle, SelectField, Spinner, TextAreaField } from "@/components/ui"

const toggle = <T,>(list: readonly T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

function ChooseRole({ user }: { user: User }) {
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

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {children}
    </Card>
  )
}

const editableFields = ({ displayName, headline, city, bio, website, categories, platforms, audienceAge, followers, targetAudience }: Profile): ProfileFields => ({
  displayName,
  headline,
  city,
  bio,
  website,
  categories,
  platforms,
  audienceAge,
  followers,
  targetAudience
})

const trimmed = (fields: ProfileFields): ProfileFields =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])) as ProfileFields

function ProfileForm({ profile, initialContacts }: { profile: Profile; initialContacts: Contacts }) {
  const router = useRouter()
  const params = useSearchParams()
  const saveProfile = useSaveProfile()
  const isBrand = profile.role === "brand"
  const [form, setForm] = useState<ProfileFields>(() => editableFields(profile))
  const [contacts, setContacts] = useState<Contacts>(initialContacts)
  const [error, setError] = useState("")

  type TextKey = { [K in keyof ProfileFields]: ProfileFields[K] extends string ? K : never }[keyof ProfileFields]
  const set = (key: TextKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))
  const setContact = (key: keyof Contacts) => (e: ChangeEvent<HTMLInputElement>) =>
    setContacts((c) => ({ ...c, [key]: e.target.value }))
  const toggleIn = (key: "categories" | "platforms", value: string) => () =>
    setForm((f) => ({ ...f, [key]: toggle(f[key], value) }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.categories.length) {
      setError("Pick at least one category so the right people can find you.")
      return
    }
    setError("")
    saveProfile.mutate(
      { uid: profile.uid, fields: trimmed(form), contacts },
      {
        onSuccess: () => router.push(`/u/${profile.uid}`),
        onError: () => setError("Couldn't save your profile. Please try again.")
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PageTitle eyebrow={params.get("welcome") ? "Welcome to Influate" : "Your profile"} title="Edit profile">
        {isBrand
          ? "Tell creators what you sell and who you want to reach. Everything except your contact details is public."
          : "Show brands what you create and who follows you. Everything except your contact details is public."}
      </PageTitle>

      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="displayName" label={isBrand ? "Company name" : "Name"} value={form.displayName} onChange={set("displayName")} required />
          <Field id="city" label="City" value={form.city} onChange={set("city")} placeholder="Sofia" />
        </div>
        <Field
          id="headline"
          label="Headline"
          value={form.headline}
          onChange={set("headline")}
          maxLength={80}
          placeholder={isBrand ? "Sustainable sportswear made in Bulgaria" : "Home workouts for busy parents"}
        />
        <TextAreaField
          id="bio"
          label="About"
          value={form.bio}
          onChange={set("bio")}
          maxLength={600}
          placeholder={
            isBrand
              ? "What you sell, what makes it different, and what kind of partnerships you're open to."
              : "What you post, your style, and what kind of partnerships you're open to."
          }
        />
        <Field id="website" type="url" label="Website" value={form.website} onChange={set("website")} placeholder="https://" />
      </Section>

      <Section title={isBrand ? "What you sell" : "What you create"} description="Choose every category that fits. This drives search.">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <ChipToggle key={c} selected={form.categories.includes(c)} onClick={toggleIn("categories", c)}>
              {c}
            </ChipToggle>
          ))}
        </div>
      </Section>

      <Section title={isBrand ? "Who you want to reach" : "Your audience"}>
        {!isBrand && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-subtle">Platforms</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Platforms">
              {PLATFORMS.map((p) => (
                <ChipToggle key={p} selected={form.platforms.includes(p)} onClick={toggleIn("platforms", p)}>
                  {p}
                </ChipToggle>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="audienceAge"
            label={isBrand ? "Target age" : "Main audience age"}
            options={AUDIENCE_AGES}
            value={form.audienceAge}
            onChange={set("audienceAge")}
          />
          {!isBrand && (
            <SelectField
              id="followers"
              label="Followers (all platforms)"
              options={FOLLOWER_RANGES}
              value={form.followers}
              onChange={set("followers")}
              hint="Self-reported for now"
            />
          )}
        </div>
        <Field
          id="targetAudience"
          label={isBrand ? "Describe your ideal customer" : "Describe your audience"}
          value={form.targetAudience}
          onChange={set("targetAudience")}
          maxLength={160}
          placeholder={isBrand ? "Active women 25–40 who train at home" : "Mostly women 25–34, interested in fitness and healthy food"}
        />
      </Section>

      <Section title="Contact details" description="Private. Shown only to people whose connect request you accept, and to people who accept yours.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="contactEmail" type="email" label="Contact email" value={contacts.email} onChange={setContact("email")} />
          <Field id="phone" type="tel" label="Phone" value={contacts.phone} onChange={setContact("phone")} />
        </div>
        <Field id="links" label="Social links" value={contacts.links} onChange={setContact("links")} placeholder="instagram.com/you, tiktok.com/@you" />
      </Section>

      <ErrorNote>{error}</ErrorNote>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={saveProfile.isPending}>
          {saveProfile.isPending ? "Saving…" : "Save profile"}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

const noContacts: Contacts = { email: "", phone: "", links: "" }

/** Waits for the private contact details so the form can start from them. */
function ProfileFormLoader({ profile }: { profile: Profile }) {
  const contacts = useContacts(profile.uid)
  if (contacts.isPending) return <Spinner />
  return <ProfileForm profile={profile} initialContacts={contacts.data ?? noContacts} />
}

function EditProfile() {
  const { user, profile } = useAuth()
  if (!user) return null
  return (
    <main className="mx-auto max-w-[820px] px-6 pb-24 pt-4">
      {profile ? <ProfileFormLoader key={profile.uid} profile={profile} /> : <ChooseRole user={user} />}
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
