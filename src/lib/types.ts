// Domain types used by the UI. Database rows (snake_case) are mapped to these in data.ts.

export type Role = "creator" | "brand"

/** ISO 8601 timestamp, e.g. "2026-11-03T10:00:00+00:00". */
export type Timestamp = string

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
  createdAt: Timestamp
  updatedAt: Timestamp
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
  /** Both users' ids. */
  participants: string[]
  fromUid: string
  toUid: string
  note: string
  status: ConnectionStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type PartnershipStatus = "active" | "ended"

export interface Partnership {
  id: string
  /** Null once that account has been deleted. */
  creatorUid: string | null
  brandUid: string | null
  /** The ids of the sides that still exist. */
  participants: string[]
  createdBy: string | null
  title: string
  code: string
  terms: string
  status: PartnershipStatus
  createdAt: Timestamp
}

export interface PartnershipResult {
  id: string
  partnershipId: string
  /** Null once the author's account has been deleted. */
  createdBy: string | null
  /** YYYY-MM-DD */
  date: string
  sales: number
  revenue: number
  earnings: number
  note: string
  createdAt: Timestamp
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
