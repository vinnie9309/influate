import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentSnapshot,
  type QueryConstraint,
  type QuerySnapshot
} from "firebase/firestore"
import { db } from "./firebase"
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

// Collections
//   profiles/{uid}        public profile, readable by anyone
//   contacts/{uid}        private contact details, readable once a connection is accepted
//   connections/{a_b}     one request per pair of users, id = sorted uids
//   partnerships/{id}     creator + brand + affiliate code
//   results/{id}          manually logged sales for a partnership
//
// Every function here is a plain async read or write; caching and refetching live in queries.ts.

export const pairId = (a: string, b: string): string => [a, b].sort().join("_")

const fromDoc = <T>(snap: DocumentSnapshot): T | null => (snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null)

const fromQuery = <T>(snap: QuerySnapshot): T[] => snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)

const listWhere = async <T>(name: string, ...constraints: QueryConstraint[]): Promise<T[]> =>
  fromQuery<T>(await getDocs(query(collection(db, name), ...constraints)))

// Profiles

export async function createProfile(uid: string, { role, displayName, email }: { role: Role; displayName: string; email: string | null }) {
  const profile: Omit<Profile, "createdAt" | "updatedAt"> = {
    uid,
    role,
    displayName,
    headline: "",
    bio: "",
    city: "",
    categories: [],
    platforms: [],
    audienceAge: "",
    followers: "",
    targetAudience: "",
    website: ""
  }
  await setDoc(doc(db, "profiles", uid), { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  await setDoc(doc(db, "contacts", uid), { email: email ?? "", phone: "", links: "" } satisfies Contacts)
}

export async function updateProfile(uid: string, fields: ProfileFields): Promise<void> {
  await updateDoc(doc(db, "profiles", uid), { ...fields, updatedAt: serverTimestamp() })
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "profiles", uid))
  return snap.exists() ? (snap.data() as Profile) : null
}

export function searchProfiles({ role, category }: { role: Role; category: string }): Promise<Profile[]> {
  const filters = [where("role", "==", role), ...(category ? [where("categories", "array-contains", category)] : [])]
  return listWhere<Profile>("profiles", ...filters, limit(100))
}

// Contacts

export async function getContacts(uid: string): Promise<Contacts | null> {
  const snap = await getDoc(doc(db, "contacts", uid))
  return snap.exists() ? (snap.data() as Contacts) : null
}

export async function saveContacts(uid: string, contacts: Contacts): Promise<void> {
  await setDoc(doc(db, "contacts", uid), contacts, { merge: true })
}

// Connections

export async function getConnection(me: string, other: string): Promise<Connection | null> {
  return fromDoc<Connection>(await getDoc(doc(db, "connections", pairId(me, other))))
}

export const getMyConnections = (uid: string) => listWhere<Connection>("connections", where("participants", "array-contains", uid))

export async function requestConnection({ fromUid, toUid, note }: { fromUid: string; toUid: string; note: string }) {
  await setDoc(doc(db, "connections", pairId(fromUid, toUid)), {
    participants: [fromUid, toUid].sort(),
    fromUid,
    toUid,
    note: note.trim(),
    status: "pending" satisfies ConnectionStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function respondToConnection({ id, status }: { id: string; status: Exclude<ConnectionStatus, "pending"> }) {
  await updateDoc(doc(db, "connections", id), { status, updatedAt: serverTimestamp() })
}

export async function removeConnection(id: string): Promise<void> {
  await deleteDoc(doc(db, "connections", id))
}

// Partnerships

export async function createPartnership({ creatorUid, brandUid, createdBy, title, code, terms }: PartnershipInput): Promise<string> {
  const ref = await addDoc(collection(db, "partnerships"), {
    creatorUid,
    brandUid,
    participants: [creatorUid, brandUid].sort(),
    createdBy,
    title: title.trim(),
    code: code.trim().toUpperCase(),
    terms: terms.trim(),
    status: "active" satisfies PartnershipStatus,
    createdAt: serverTimestamp()
  })
  return ref.id
}

export const getMyPartnerships = (uid: string) =>
  listWhere<Partnership>("partnerships", where("participants", "array-contains", uid))

/** Throws "permission-denied" when the viewer isn't a participant (or the partnership doesn't exist). */
export async function getPartnership(id: string): Promise<Partnership | null> {
  return fromDoc<Partnership>(await getDoc(doc(db, "partnerships", id)))
}

export async function setPartnershipStatus({ id, status }: { id: string; status: PartnershipStatus }) {
  await updateDoc(doc(db, "partnerships", id), { status })
}

// Results

export const getMyResults = (uid: string) =>
  listWhere<PartnershipResult>("results", where("participants", "array-contains", uid))

export const getPartnershipResults = (partnershipId: string, uid: string) =>
  listWhere<PartnershipResult>(
    "results",
    where("partnershipId", "==", partnershipId),
    where("participants", "array-contains", uid)
  )

export async function addResult({ partnership, createdBy, input }: { partnership: Partnership; createdBy: string; input: ResultInput }) {
  const { date, sales, revenue, earnings, note } = input
  await addDoc(collection(db, "results"), {
    partnershipId: partnership.id,
    participants: partnership.participants,
    createdBy,
    date,
    sales: Number(sales) || 0,
    revenue: Number(revenue) || 0,
    earnings: Number(earnings) || 0,
    note: note.trim(),
    createdAt: serverTimestamp()
  })
}

export async function deleteResult(id: string): Promise<void> {
  await deleteDoc(doc(db, "results", id))
}

export const emptyTotals = (): Totals => ({ sales: 0, revenue: 0, earnings: 0 })

export const sumResults = (results: readonly PartnershipResult[]): Totals =>
  results.reduce(
    (t, { sales, revenue, earnings }) => ({ sales: t.sales + sales, revenue: t.revenue + revenue, earnings: t.earnings + earnings }),
    emptyTotals()
  )
