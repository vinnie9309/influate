import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore"
import { db } from "./firebase"

// Collections
//   profiles/{uid}        public profile, readable by anyone
//   contacts/{uid}        private contact details, readable once a connection is accepted
//   connections/{a_b}     one request per pair of users, id = sorted uids
//   partnerships/{id}     creator + brand + affiliate code
//   results/{id}          manually logged sales for a partnership

export function pairId(a, b) {
  return [a, b].sort().join("_")
}

const snapToList = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

// Profiles

export async function createProfile(uid, { role, displayName, email }) {
  await setDoc(doc(db, "profiles", uid), {
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
    website: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  await setDoc(doc(db, "contacts", uid), { email: email ?? "", phone: "", links: "" })
}

export async function updateProfile(uid, fields) {
  await updateDoc(doc(db, "profiles", uid), { ...fields, updatedAt: serverTimestamp() })
}

export function watchProfile(uid, callback) {
  return onSnapshot(doc(db, "profiles", uid), (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null))
}

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, "profiles", uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function searchProfiles({ role, category }) {
  const filters = [where("role", "==", role)]
  if (category) filters.push(where("categories", "array-contains", category))
  const snap = await getDocs(query(collection(db, "profiles"), ...filters, limit(100)))
  return snapToList(snap)
}

// Contacts

export async function getContacts(uid) {
  const snap = await getDoc(doc(db, "contacts", uid))
  return snap.exists() ? snap.data() : null
}

export async function saveContacts(uid, fields) {
  await setDoc(doc(db, "contacts", uid), fields, { merge: true })
}

// Connections

// `confirmed` is false while a local change (e.g. accepting) hasn't reached the server yet;
// reads that depend on the connection are denied by the rules until it has.
export function watchConnection(me, other, callback) {
  return onSnapshot(doc(db, "connections", pairId(me, other)), { includeMetadataChanges: true }, (snap) =>
    callback(snap.exists() ? { id: snap.id, ...snap.data(), confirmed: !snap.metadata.hasPendingWrites } : null)
  )
}

export function watchMyConnections(uid, callback) {
  const q = query(collection(db, "connections"), where("participants", "array-contains", uid))
  return onSnapshot(q, (snap) => callback(snapToList(snap)))
}

export async function requestConnection(fromUid, toUid, note) {
  await setDoc(doc(db, "connections", pairId(fromUid, toUid)), {
    participants: [fromUid, toUid].sort(),
    fromUid,
    toUid,
    note: note.trim(),
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function respondToConnection(id, status) {
  await updateDoc(doc(db, "connections", id), { status, updatedAt: serverTimestamp() })
}

export async function removeConnection(id) {
  await deleteDoc(doc(db, "connections", id))
}

// Partnerships

export async function createPartnership({ creatorUid, brandUid, createdBy, title, code, terms }) {
  const ref = await addDoc(collection(db, "partnerships"), {
    creatorUid,
    brandUid,
    participants: [creatorUid, brandUid].sort(),
    createdBy,
    title: title.trim(),
    code: code.trim().toUpperCase(),
    terms: terms.trim(),
    status: "active",
    createdAt: serverTimestamp()
  })
  return ref.id
}

export function watchMyPartnerships(uid, callback) {
  const q = query(collection(db, "partnerships"), where("participants", "array-contains", uid))
  return onSnapshot(q, (snap) => callback(snapToList(snap)))
}

export function watchPartnership(id, callback, onError) {
  return onSnapshot(
    doc(db, "partnerships", id),
    (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError
  )
}

export async function setPartnershipStatus(id, status) {
  await updateDoc(doc(db, "partnerships", id), { status })
}

// Results

export function watchMyResults(uid, callback) {
  const q = query(collection(db, "results"), where("participants", "array-contains", uid))
  return onSnapshot(q, (snap) => callback(snapToList(snap)))
}

export function watchPartnershipResults(partnership, uid, callback) {
  const q = query(
    collection(db, "results"),
    where("partnershipId", "==", partnership.id),
    where("participants", "array-contains", uid)
  )
  return onSnapshot(q, (snap) => callback(snapToList(snap)))
}

export async function addResult(partnership, createdBy, { date, sales, revenue, earnings, note }) {
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

export async function deleteResult(id) {
  await deleteDoc(doc(db, "results", id))
}

export function sumResults(results) {
  return results.reduce(
    (t, r) => ({ sales: t.sales + r.sales, revenue: t.revenue + r.revenue, earnings: t.earnings + r.earnings }),
    { sales: 0, revenue: 0, earnings: 0 }
  )
}
