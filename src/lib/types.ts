import type { Timestamp } from "firebase/firestore"

export type Role = "creator" | "brand"

export interface Profile {
  uid: string
  role: Role
  displayName: string
  headline: string
  bio: string
  city: string
  categories: string[]
  platforms: string[]
  audienceAge: string
  followers: string
  targetAudience: string
  website: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

/** The fields a user edits on their own profile. */
export type ProfileFields = Omit<Profile, "uid" | "role" | "createdAt" | "updatedAt">

export interface Contacts {
  email: string
  phone: string
  links: string
}

export type ConnectionStatus = "pending" | "accepted" | "declined"

export interface Connection {
  id: string
  participants: string[]
  fromUid: string
  toUid: string
  note: string
  status: ConnectionStatus
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export type PartnershipStatus = "active" | "ended"

export interface Partnership {
  id: string
  creatorUid: string
  brandUid: string
  participants: string[]
  createdBy: string
  title: string
  code: string
  terms: string
  status: PartnershipStatus
  createdAt: Timestamp | null
}

export interface PartnershipResult {
  id: string
  partnershipId: string
  participants: string[]
  createdBy: string
  /** YYYY-MM-DD */
  date: string
  sales: number
  revenue: number
  earnings: number
  note: string
  createdAt: Timestamp | null
}

export interface Totals {
  sales: number
  revenue: number
  earnings: number
}

/** Form values for logging a result; numbers arrive as input strings. */
export interface ResultInput {
  date: string
  sales: string
  revenue: string
  earnings: string
  note: string
}

export interface PartnershipInput {
  creatorUid: string
  brandUid: string
  createdBy: string
  title: string
  code: string
  terms: string
}
