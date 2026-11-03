"use client"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AUDIENCE_AGES, CATEGORIES, FOLLOWER_RANGES, PLATFORMS } from "@/lib/constants"
import { createProfile, getContacts, saveContacts, updateProfile } from "@/lib/data"
import RequireAuth from "@/components/RequireAuth"
import RolePicker from "@/components/RolePicker"
import { Button, Card, ChipToggle, ErrorNote, Field, PageTitle, Spinner } from "@/components/ui"

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function ChooseRole({ user }) {
  const [role, setRole] = useState("creator")
  const [name, setName] = useState(user.displayName ?? "")
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    await createProfile(user.uid, { role, displayName: name.trim(), email: user.email })
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
        <Button type="submit" size="lg" disabled={busy}>
          Continue
        </Button>
      </form>
    </Card>
  )
}

function Section({ title, description, children }) {
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

function ProfileForm({ profile }) {
  const router = useRouter()
  const params = useSearchParams()
  const isBrand = profile.role === "brand"
  const [form, setForm] = useState({
    displayName: profile.displayName ?? "",
    headline: profile.headline ?? "",
    city: profile.city ?? "",
    bio: profile.bio ?? "",
    website: profile.website ?? "",
    categories: profile.categories ?? [],
    platforms: profile.platforms ?? [],
    audienceAge: profile.audienceAge ?? "",
    followers: profile.followers ?? "",
    targetAudience: profile.targetAudience ?? ""
  })
  const [contacts, setContacts] = useState(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getContacts(profile.uid).then((c) => setContacts(c ?? { email: "", phone: "", links: "" }))
  }, [profile.uid])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setContact = (key) => (e) => setContacts((c) => ({ ...c, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.categories.length) {
      setError("Pick at least one category so the right people can find you.")
      return
    }
    setError("")
    setBusy(true)
    try {
      await updateProfile(profile.uid, {
        ...form,
        displayName: form.displayName.trim(),
        headline: form.headline.trim(),
        city: form.city.trim(),
        bio: form.bio.trim(),
        website: form.website.trim(),
        targetAudience: form.targetAudience.trim()
      })
      await saveContacts(profile.uid, contacts)
      router.push(`/u/${profile.uid}`)
    } catch {
      setError("Couldn't save your profile. Please try again.")
      setBusy(false)
    }
  }

  if (!contacts) return <Spinner />

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
        <Field
          id="bio"
          as="textarea"
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
            <ChipToggle
              key={c}
              selected={form.categories.includes(c)}
              onClick={() => setForm((f) => ({ ...f, categories: toggle(f.categories, c) }))}
            >
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
                <ChipToggle
                  key={p}
                  selected={form.platforms.includes(p)}
                  onClick={() => setForm((f) => ({ ...f, platforms: toggle(f.platforms, p) }))}
                >
                  {p}
                </ChipToggle>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="audienceAge"
            as="select"
            label={isBrand ? "Target age" : "Main audience age"}
            options={AUDIENCE_AGES}
            value={form.audienceAge}
            onChange={set("audienceAge")}
          />
          {!isBrand && (
            <Field
              id="followers"
              as="select"
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
        <Field
          id="links"
          label="Social links"
          value={contacts.links}
          onChange={setContact("links")}
          placeholder="instagram.com/you, tiktok.com/@you"
        />
      </Section>

      <ErrorNote>{error}</ErrorNote>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : "Save profile"}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function EditProfile() {
  const { user, profile } = useAuth()
  return (
    <main className="mx-auto max-w-[820px] px-6 pb-24 pt-4">
      {profile ? <ProfileForm key={profile.uid} profile={profile} /> : <ChooseRole user={user} />}
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
