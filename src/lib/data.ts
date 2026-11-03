import type { PostgrestError } from "@supabase/supabase-js"
import type { Json, Tables } from "./database.types"
import { supabase } from "./supabase"
import type {
  Connection,
  ConnectionStatus,
  Contacts,
  Partnership,
  PartnershipInput,
  PartnershipResult,
  PartnershipStatus,
  Profile,
  ProfileFields,
  ResultInput,
  Role,
  Totals
} from "./types"

// Plain async reads and writes against Supabase; caching and refetching live in queries.ts.
// Row-level security in the database (supabase/migrations) decides what each user may see.

/** Stable key for the connection between two users, whoever asked first. */
export const pairId = (a: string, b: string): string => [a, b].sort().join("_")

/** Unwraps a Supabase response, throwing its error. */
function must<T>(result: { data: T; error: null } | { data: null; error: PostgrestError }): T {
  if (result.error) throw result.error
  return result.data
}

const isPresent = <T>(value: T | null): value is T => value !== null

// Row → domain mapping

const toProfile = (row: Tables<"profiles">): Profile => ({
  uid: row.id,
  role: row.role,
  displayName: row.display_name,
  headline: row.headline,
  bio: row.bio,
  city: row.city,
  categories: row.categories,
  platforms: row.platforms,
  audienceAge: row.audience_age,
  followers: row.followers,
  targetAudience: row.target_audience,
  website: row.website,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

const toConnection = (row: Tables<"connections">): Connection => ({
  id: row.id,
  participants: [row.from_id, row.to_id],
  fromUid: row.from_id,
  toUid: row.to_id,
  note: row.note,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

const toPartnership = (row: Tables<"partnerships">): Partnership => ({
  id: row.id,
  creatorUid: row.creator_id,
  brandUid: row.brand_id,
  participants: [row.creator_id, row.brand_id].filter(isPresent),
  createdBy: row.created_by,
  title: row.title,
  code: row.code,
  terms: row.terms,
  status: row.status,
  createdAt: row.created_at
})

const toResult = (row: Tables<"results">): PartnershipResult => ({
  id: row.id,
  partnershipId: row.partnership_id,
  createdBy: row.created_by,
  date: row.date,
  sales: row.sales,
  revenue: Number(row.revenue),
  earnings: Number(row.earnings),
  note: row.note,
  createdAt: row.created_at
})

// Profiles

/** For accounts without a profile yet (e.g. after Google sign-in). Email sign-ups get theirs from a database trigger. */
export async function createProfile({ role, displayName }: { role: Role; displayName: string }): Promise<void> {
  must(await supabase.rpc("create_my_profile", { p_role: role, p_display_name: displayName }))
}

export async function updateProfile(uid: string, fields: ProfileFields): Promise<void> {
  must(
    await supabase
      .from("profiles")
      .update({
        display_name: fields.displayName,
        headline: fields.headline,
        bio: fields.bio,
        city: fields.city,
        categories: fields.categories,
        platforms: fields.platforms,
        audience_age: fields.audienceAge,
        followers: fields.followers,
        target_audience: fields.targetAudience,
        website: fields.website
      })
      .eq("id", uid)
  )
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const row = must(await supabase.from("profiles").select().eq("id", uid).maybeSingle())
  return row && toProfile(row)
}

export async function searchProfiles({ role, category }: { role: Role; category: string }): Promise<Profile[]> {
  const base = supabase.from("profiles").select().eq("role", role)
  const query = category ? base.contains("categories", [category]) : base
  return must(await query.limit(100)).map(toProfile)
}

// Contacts

export async function getContacts(uid: string): Promise<Contacts | null> {
  return must(await supabase.from("contacts").select("email, phone, links").eq("id", uid).maybeSingle())
}

export async function saveContacts(uid: string, contacts: Contacts): Promise<void> {
  must(await supabase.from("contacts").update(contacts).eq("id", uid))
}

// Connections

const between = (a: string, b: string) => `and(from_id.eq.${a},to_id.eq.${b}),and(from_id.eq.${b},to_id.eq.${a})`

export async function getConnection(me: string, other: string): Promise<Connection | null> {
  const row = must(await supabase.from("connections").select().or(between(me, other)).maybeSingle())
  return row && toConnection(row)
}

export async function getMyConnections(uid: string): Promise<Connection[]> {
  return must(await supabase.from("connections").select().or(`from_id.eq.${uid},to_id.eq.${uid}`)).map(toConnection)
}

export async function requestConnection({ fromUid, toUid, note }: { fromUid: string; toUid: string; note: string }) {
  must(await supabase.from("connections").insert({ from_id: fromUid, to_id: toUid, note: note.trim() }))
}

export async function respondToConnection({ id, status }: { id: string; status: Exclude<ConnectionStatus, "pending"> }) {
  must(await supabase.from("connections").update({ status }).eq("id", id))
}

export async function removeConnection(id: string): Promise<void> {
  must(await supabase.from("connections").delete().eq("id", id))
}

// Partnerships

export async function createPartnership({ creatorUid, brandUid, createdBy, title, code, terms }: PartnershipInput): Promise<string> {
  const { data, error } = await supabase
    .from("partnerships")
    .insert({
      creator_id: creatorUid,
      brand_id: brandUid,
      created_by: createdBy,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      terms: terms.trim()
    })
    .select("id")
    .single()
  if (error) throw error
  return data.id
}

export async function getMyPartnerships(uid: string): Promise<Partnership[]> {
  return must(await supabase.from("partnerships").select().or(`creator_id.eq.${uid},brand_id.eq.${uid}`)).map(toPartnership)
}

/** Null when it doesn't exist or the viewer isn't part of it (the database hides it either way). */
export async function getPartnership(id: string): Promise<Partnership | null> {
  const row = must(await supabase.from("partnerships").select().eq("id", id).maybeSingle())
  return row && toPartnership(row)
}

export async function setPartnershipStatus({ id, status }: { id: string; status: PartnershipStatus }) {
  must(await supabase.from("partnerships").update({ status }).eq("id", id))
}

// Results

/** Every result in the viewer's partnerships (the database only returns those). */
export async function getMyResults(): Promise<PartnershipResult[]> {
  return must(await supabase.from("results").select()).map(toResult)
}

export async function getPartnershipResults(partnershipId: string): Promise<PartnershipResult[]> {
  return must(await supabase.from("results").select().eq("partnership_id", partnershipId)).map(toResult)
}

export async function addResult({ partnership, createdBy, input }: { partnership: Partnership; createdBy: string; input: ResultInput }) {
  const { date, sales, revenue, earnings, note } = input
  must(
    await supabase.from("results").insert({
      partnership_id: partnership.id,
      created_by: createdBy,
      date,
      sales: Number(sales) || 0,
      revenue: Number(revenue) || 0,
      earnings: Number(earnings) || 0,
      note: note.trim()
    })
  )
}

export async function deleteResult(id: string): Promise<void> {
  must(await supabase.from("results").delete().eq("id", id))
}

export const emptyTotals = (): Totals => ({ sales: 0, revenue: 0, earnings: 0 })

export const sumResults = (results: readonly PartnershipResult[]): Totals =>
  results.reduce(
    (t, { sales, revenue, earnings }) => ({ sales: t.sales + sales, revenue: t.revenue + revenue, earnings: t.earnings + earnings }),
    emptyTotals()
  )

// Account

/** Everything stored about the signed-in user, as one JSON document. */
export async function exportMyData(): Promise<Json> {
  return must(await supabase.rpc("export_my_data"))
}

/** Permanently deletes the signed-in user's account. Follow with signOut({ scope: "local" }). */
export async function deleteMyAccount(): Promise<void> {
  must(await supabase.rpc("delete_my_account"))
}

/** Ends the session: everywhere by default, or only in this browser (e.g. after the account is gone). */
export async function signOut({ scope = "global" }: { scope?: "global" | "local" } = {}): Promise<void> {
  await supabase.auth.signOut({ scope })
}
