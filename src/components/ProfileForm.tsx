"use client"
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { AUDIENCE_AGES, CATEGORIES, FOLLOWER_RANGES, PLATFORMS } from "@/lib/constants"
import { useSaveProfile } from "@/lib/queries"
import type { Contacts, Profile, ProfileFields } from "@/lib/types"
import SectionCard from "./SectionCard"
import { Button, ChipToggle, ErrorNote, Field, SelectField, TextAreaField } from "./ui"

const toggle = <T,>(list: readonly T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

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

type TextKey = { [K in keyof ProfileFields]: ProfileFields[K] extends string ? K : never }[keyof ProfileFields]

interface ProfileFormProps {
  profile: Profile
  initialContacts: Contacts
  /** Heading area above the form sections. */
  header?: ReactNode
  onSaved: () => void
  onCancel: () => void
}

/** Edits a profile's public fields and private contact details. */
export default function ProfileForm({ profile, initialContacts, header, onSaved, onCancel }: ProfileFormProps) {
  const saveProfile = useSaveProfile()
  const isBrand = profile.role === "brand"
  const [form, setForm] = useState<ProfileFields>(() => editableFields(profile))
  const [contacts, setContacts] = useState<Contacts>(initialContacts)
  const [error, setError] = useState("")

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
      { onSuccess: onSaved, onError: () => setError("Couldn't save your profile. Please try again.") }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {header}

      <SectionCard title="Basics">
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
      </SectionCard>

      <SectionCard title={isBrand ? "What you sell" : "What you create"} description="Choose every category that fits. This drives search.">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <ChipToggle key={c} selected={form.categories.includes(c)} onClick={toggleIn("categories", c)}>
              {c}
            </ChipToggle>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={isBrand ? "Who you want to reach" : "Your audience"}>
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
      </SectionCard>

      <SectionCard title="Contact details" description="Private. Shown only to people whose connect request you accept, and to people who accept yours.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="contactEmail" type="email" label="Contact email" value={contacts.email} onChange={setContact("email")} />
          <Field id="phone" type="tel" label="Phone" value={contacts.phone} onChange={setContact("phone")} />
        </div>
        <Field id="links" label="Social links" value={contacts.links} onChange={setContact("links")} placeholder="instagram.com/you, tiktok.com/@you" />
      </SectionCard>

      <ErrorNote>{error}</ErrorNote>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={saveProfile.isPending}>
          {saveProfile.isPending ? "Saving…" : "Save profile"}
        </Button>
        <Button variant="ghost" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
