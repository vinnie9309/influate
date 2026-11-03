"use client"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ExternalLink, MapPin } from "lucide-react"
import { ROLES } from "@/lib/constants"
import { useAuth, useConnection, useProfile } from "@/lib/queries"
import ConnectPanel from "@/components/ConnectPanel"
import ContactDetails from "@/components/ContactDetails"
import DetailTile from "@/components/DetailTile"
import NewPartnershipForm from "@/components/NewPartnershipForm"
import PageMessage from "@/components/PageMessage"
import SectionCard from "@/components/SectionCard"
import { Avatar, Button, Card, Spinner, Tag } from "@/components/ui"

const isWebUrl = (value: string) => /^https?:\/\//.test(value)

export default function PublicProfilePage() {
  const { uid } = useParams<{ uid: string }>()
  const { user, profile: me, loading } = useAuth()
  const { data: profile, isPending } = useProfile(uid)
  const { data: connection = null } = useConnection(me?.uid, uid)
  const [startingPartnership, setStartingPartnership] = useState(false)

  if (isPending || loading) return <Spinner />
  if (!profile) return <PageMessage title="Profile not found">This profile doesn&apos;t exist or was removed.</PageMessage>

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
            <DetailTile label={isBrand ? "Sells" : "Creates"}>{profile.categories.join(", ")}</DetailTile>
            <DetailTile label="Platforms">{isBrand ? "" : profile.platforms.join(", ")}</DetailTile>
            <DetailTile label={isBrand ? "Target age" : "Audience age"}>{profile.audienceAge}</DetailTile>
            <DetailTile label="Followers">{profile.followers}</DetailTile>
          </div>
          <DetailTile label={isBrand ? "Ideal customer" : "Audience"}>{profile.targetAudience}</DetailTile>
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
        <SectionCard
          title="Contact details"
          description={isMe && "Only you and people you're connected with can see these."}
        >
          <ContactDetails uid={uid} visible={isMe || connected} name={profile.displayName} />
        </SectionCard>
      )}

      {connected && me && (
        <SectionCard
          title="Work together"
          description="Set up a partnership with an affiliate code to track its results."
          action={!startingPartnership && <Button onClick={() => setStartingPartnership(true)}>New partnership</Button>}
        >
          {startingPartnership && <NewPartnershipForm me={me} other={profile} onCancel={() => setStartingPartnership(false)} />}
        </SectionCard>
      )}
    </main>
  )
}
