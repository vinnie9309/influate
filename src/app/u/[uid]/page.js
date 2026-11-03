"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ExternalLink, Lock, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ROLES } from "@/lib/constants"
import { getContacts, watchConnection, watchProfile } from "@/lib/data"
import ConnectPanel from "@/components/ConnectPanel"
import NewPartnershipForm from "@/components/NewPartnershipForm"
import { Avatar, Button, Card, PageTitle, Spinner, Tag } from "@/components/ui"

function Detail({ label, children }) {
  if (!children || (Array.isArray(children) && !children.length)) return null
  return (
    <div className="flex flex-col gap-1 rounded-[14px] bg-paper p-3.5">
      <span className="text-xs text-muted">{label}</span>
      <strong className="text-[15px]">{children}</strong>
    </div>
  )
}

function Contacts({ uid, visible, name }) {
  const [contacts, setContacts] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!visible) return
    getContacts(uid)
      .then(setContacts)
      .catch(() => setFailed(true))
  }, [uid, visible])

  if (visible && failed) return <p className="text-sm text-danger">Couldn&apos;t load contact details. Refresh to try again.</p>

  if (!visible) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 py-3 text-sm text-body">
        <Lock aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-muted" />
        Contact details are shared after {name} accepts a connect request.
      </div>
    )
  }
  if (!contacts) return null
  const rows = [
    ["Email", contacts.email],
    ["Phone", contacts.phone],
    ["Links", contacts.links]
  ].filter(([, v]) => v)
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {rows.length ? (
        rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 rounded-[14px] bg-brand-soft p-3.5">
            <dt className="text-xs text-brand-dark">{k}</dt>
            <dd className="wrap-break-word text-[15px] font-bold">{v}</dd>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted">No contact details added yet.</p>
      )}
    </dl>
  )
}

export default function PublicProfilePage() {
  const { uid } = useParams()
  const { user, profile: me, loading } = useAuth()
  const [profile, setProfile] = useState(undefined)
  const [connection, setConnection] = useState(null)
  const [startingPartnership, setStartingPartnership] = useState(false)

  useEffect(() => watchProfile(uid, setProfile), [uid])

  const isMe = me?.uid === uid
  useEffect(() => {
    if (!me || isMe) return
    return watchConnection(me.uid, uid, setConnection)
  }, [me, uid, isMe])

  if (profile === undefined || loading) return <Spinner />
  if (!profile) {
    return (
      <main className="mx-auto max-w-[820px] px-6 pb-24 pt-4">
        <PageTitle title="Profile not found">This profile doesn&apos;t exist or was removed.</PageTitle>
      </main>
    )
  }

  const connected = connection?.status === "accepted" && connection.confirmed
  const details = profile.role === "creator" ? profile.platforms : []

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
                  <Tag tone={profile.role === "brand" ? "dark" : "brand"}>{ROLES[profile.role].label}</Tag>
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
              ) : user && me ? (
                <ConnectPanel me={me} other={profile} connection={connection} />
              ) : (
                <Button href={`/login?next=/u/${uid}`}>Log in to connect</Button>
              )}
            </div>
          </div>

          {profile.headline && <p className="text-lg font-semibold">{profile.headline}</p>}
          {profile.bio && <p className="whitespace-pre-line text-[15px] leading-relaxed text-body">{profile.bio}</p>}
          {isMe && !profile.categories?.length && (
            <p className="rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium text-sun-ink">
              Your profile is almost empty. <Link href="/profile/edit" className="underline">Add your details</Link> so the
              right people can find you.
            </p>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
            <Detail label={profile.role === "brand" ? "Sells" : "Creates"}>{profile.categories?.join(", ")}</Detail>
            <Detail label="Platforms">{details?.join(", ")}</Detail>
            <Detail label={profile.role === "brand" ? "Target age" : "Audience age"}>{profile.audienceAge}</Detail>
            <Detail label="Followers">{profile.followers}</Detail>
          </div>
          {profile.targetAudience && (
            <Detail label={profile.role === "brand" ? "Ideal customer" : "Audience"}>{profile.targetAudience}</Detail>
          )}
          {/^https?:\/\//.test(profile.website ?? "") && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-1.5 self-start text-[15px] font-semibold">
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
          <Contacts uid={uid} visible={isMe || connected} name={profile.displayName} />
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
          {startingPartnership && (
            <NewPartnershipForm me={me} other={profile} onCancel={() => setStartingPartnership(false)} />
          )}
        </Card>
      )}
    </main>
  )
}
