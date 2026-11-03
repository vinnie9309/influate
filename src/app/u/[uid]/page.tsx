"use client"
import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ExternalLink, Lock, MapPin } from "lucide-react"
import { ROLES } from "@/lib/constants"
import { useAuth, useConnection, useContacts, useProfile } from "@/lib/queries"
import type { Contacts } from "@/lib/types"
import ConnectPanel from "@/components/ConnectPanel"
import NewPartnershipForm from "@/components/NewPartnershipForm"
import { Avatar, Button, Card, PageTitle, Spinner, Tag } from "@/components/ui"

function Detail({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null
  return (
    <div className="flex flex-col gap-1 rounded-[14px] bg-paper p-3.5">
      <span className="text-xs text-muted">{label}</span>
      <strong className="text-[15px]">{children}</strong>
    </div>
  )
}

const contactRows: readonly [label: string, key: keyof Contacts][] = [
  ["Email", "email"],
  ["Phone", "phone"],
  ["Links", "links"]
]

function ContactDetails({ uid, visible, name }: { uid: string; visible: boolean; name: string }) {
  const contacts = useContacts(uid, visible)

  if (!visible) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 py-3 text-sm text-body">
        <Lock aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-muted" />
        Contact details are shared after {name} accepts a connect request.
      </div>
    )
  }
  if (contacts.isError) return <p className="text-sm text-danger">Couldn&apos;t load contact details. Refresh to try again.</p>
  if (!contacts.data) return null

  const rows = contactRows.flatMap(([label, key]) => (contacts.data?.[key] ? [[label, contacts.data[key]] as const] : []))
  if (!rows.length) return <p className="text-sm text-muted">No contact details added yet.</p>
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 rounded-[14px] bg-brand-soft p-3.5">
          <dt className="text-xs text-brand-dark">{label}</dt>
          <dd className="wrap-break-word text-[15px] font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const isWebUrl = (value: string) => /^https?:\/\//.test(value)

export default function PublicProfilePage() {
  const { uid } = useParams<{ uid: string }>()
  const { user, profile: me, loading } = useAuth()
  const { data: profile, isPending } = useProfile(uid)
  const { data: connection = null } = useConnection(me?.uid, uid)
  const [startingPartnership, setStartingPartnership] = useState(false)

  if (isPending || loading) return <Spinner />
  if (!profile) {
    return (
      <main className="mx-auto max-w-[820px] px-6 pb-24 pt-4">
        <PageTitle title="Profile not found">This profile doesn&apos;t exist or was removed.</PageTitle>
      </main>
    )
  }

  const isMe = me?.uid === uid
  const isBrand = profile.role === "brand"
  const connected = connection?.status === "accepted"

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-6 pb-24 pt-4">
      <Card className="overflow-hidden shadow-float">
        <div className="h-24 bg-ink" aria-hidden="true">
          <svg width="100%" height="96" viewBox="0 0 600 96" preserveAspectRatio="none">
            <path d="M0 70 C 120 70, 160 30, 300 40 S 480 20, 600 10" fill="none" stroke="#1F7A5A" strokeWidth="3" />
            <circle cx="300" cy="40" r="5" fill="#F2B544" />
          </svg>
        </div>
        <div className="flex flex-col gap-5 px-6 pb-7 sm:px-8">
          <div className="-mt-9 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span className="rounded-full border-4 border-white bg-white">
                <Avatar name={profile.displayName} role={profile.role} size={80} />
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[22px] font-extrabold tracking-[-0.02em]">{profile.displayName}</h1>
                  <Tag tone={isBrand ? "dark" : "brand"}>{ROLES[profile.role].label}</Tag>
                </div>
                {profile.city && (
                  <span className="flex items-center gap-1 text-sm text-muted">
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                    {profile.city}
                  </span>
                )}
              </div>
            </div>
            <div className="flex max-w-full flex-1 justify-end sm:flex-none">
              {isMe ? (
                <Button href="/profile/edit" variant="outline">
                  Edit profile
                </Button>
              ) : me ? (
                <ConnectPanel me={me} other={profile} connection={connection} />
              ) : (
                <Button href={`/login?next=/u/${uid}`}>Log in to connect</Button>
              )}
            </div>
          </div>

          {profile.headline && <p className="text-lg font-semibold">{profile.headline}</p>}
          {profile.bio && <p className="whitespace-pre-line text-[15px] leading-relaxed text-body">{profile.bio}</p>}
          {isMe && !profile.categories.length && (
            <p className="rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium text-sun-ink">
              Your profile is almost empty.{" "}
              <Link href="/profile/edit" className="underline">
                Add your details
              </Link>{" "}
              so the right people can find you.
            </p>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
            <Detail label={isBrand ? "Sells" : "Creates"}>{profile.categories.join(", ")}</Detail>
            <Detail label="Platforms">{isBrand ? "" : profile.platforms.join(", ")}</Detail>
            <Detail label={isBrand ? "Target age" : "Audience age"}>{profile.audienceAge}</Detail>
            <Detail label="Followers">{profile.followers}</Detail>
          </div>
          <Detail label={isBrand ? "Ideal customer" : "Audience"}>{profile.targetAudience}</Detail>
          {isWebUrl(profile.website) && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1.5 self-start text-[15px] font-semibold"
            >
              {profile.website.replace(/^https?:\/\//, "")}
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </Card>

      {user && (
        <Card className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">Contact details</h2>
            {isMe && <p className="text-sm text-muted">Only you and people you&apos;re connected with can see these.</p>}
          </div>
          <ContactDetails uid={uid} visible={isMe || connected} name={profile.displayName} />
        </Card>
      )}

      {connected && me && (
        <Card className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold">Work together</h2>
              <p className="text-sm text-muted">Set up a partnership with an affiliate code to track its results.</p>
            </div>
            {!startingPartnership && <Button onClick={() => setStartingPartnership(true)}>New partnership</Button>}
          </div>
          {startingPartnership && <NewPartnershipForm me={me} other={profile} onCancel={() => setStartingPartnership(false)} />}
        </Card>
      )}
    </main>
  )
}
