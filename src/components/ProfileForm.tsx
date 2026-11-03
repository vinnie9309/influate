"use client"
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { useTranslations } from "next-intl"
import { AUDIENCE_AGES, CATEGORIES, FOLLOWER_RANGES, PLATFORMS } from "@/lib/constants"
import { useOptionLabels } from "@/lib/labels"
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
  const t = useTranslations("ProfileEdit")
  const tCommon = useTranslations("Common")
  const labels = useOptionLabels()
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
      setError(t("pickCategory"))
      return
    }
    setError("")
    saveProfile.mutate(
      { uid: profile.uid, fields: trimmed(form), contacts },
      { onSuccess: onSaved, onError: () => setError(t("saveError")) }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {header}

      <SectionCard title={t("basics")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="displayName" label={isBrand ? t("companyName") : t("name")} value={form.displayName} onChange={set("displayName")} required />
          <Field id="city" label={t("city")} value={form.city} onChange={set("city")} placeholder={t("cityPlaceholder")} />
        </div>
        <Field
          id="headline"
          label={t("headline")}
          value={form.headline}
          onChange={set("headline")}
          maxLength={80}
          placeholder={isBrand ? t("headlinePlaceholderBrand") : t("headlinePlaceholderCreator")}
        />
        <TextAreaField
          id="bio"
          label={t("about")}
          value={form.bio}
          onChange={set("bio")}
          maxLength={600}
          placeholder={isBrand ? t("aboutPlaceholderBrand") : t("aboutPlaceholderCreator")}
        />
        <Field id="website" type="url" label={t("website")} value={form.website} onChange={set("website")} placeholder="https://" />
      </SectionCard>

      <SectionCard title={isBrand ? t("sellTitle") : t("createTitle")} description={t("categoriesHint")}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("categories")}>
          {CATEGORIES.map((c) => (
            <ChipToggle key={c} selected={form.categories.includes(c)} onClick={toggleIn("categories", c)}>
              {labels.category(c)}
            </ChipToggle>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={isBrand ? t("reachTitle") : t("audienceTitle")}>
        {!isBrand && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-subtle">{t("platforms")}</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("platforms")}>
              {PLATFORMS.map((p) => (
                <ChipToggle key={p} selected={form.platforms.includes(p)} onClick={toggleIn("platforms", p)}>
                  {labels.platform(p)}
                </ChipToggle>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="audienceAge"
            label={isBrand ? t("targetAge") : t("mainAge")}
            options={AUDIENCE_AGES}
            value={form.audienceAge}
            onChange={set("audienceAge")}
          />
          {!isBrand && (
            <SelectField
              id="followers"
              label={t("followers")}
              options={FOLLOWER_RANGES}
              optionLabel={labels.followers}
              value={form.followers}
              onChange={set("followers")}
              hint={t("followersHint")}
            />
          )}
        </div>
        <Field
          id="targetAudience"
          label={isBrand ? t("idealCustomer") : t("describeAudience")}
          value={form.targetAudience}
          onChange={set("targetAudience")}
          maxLength={160}
          placeholder={isBrand ? t("idealPlaceholder") : t("audiencePlaceholder")}
        />
      </SectionCard>

      <SectionCard title={t("contactTitle")} description={t("contactHint")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="contactEmail" type="email" label={t("contactEmail")} value={contacts.email} onChange={setContact("email")} />
          <Field id="phone" type="tel" label={t("phone")} value={contacts.phone} onChange={setContact("phone")} />
        </div>
        <Field id="links" label={t("links")} value={contacts.links} onChange={setContact("links")} placeholder={t("linksPlaceholder")} />
      </SectionCard>

      <ErrorNote>{error}</ErrorNote>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={saveProfile.isPending}>
          {saveProfile.isPending ? t("saving") : t("save")}
        </Button>
        <Button variant="ghost" size="lg" onClick={onCancel}>
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  )
}
