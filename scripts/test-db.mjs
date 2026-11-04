// Exercises the row-level security rules against the local Supabase stack.
// Usage: npm run test:db (needs the local stack: npm run db:start)
import { execSync } from "node:child_process"
import { createClient } from "@supabase/supabase-js"

// Reads the local stack's API URL and publishable key from the Supabase CLI.
const status = Object.fromEntries(
  execSync("npx supabase status -o env", { encoding: "utf8" })
    .split("\n")
    .map((line) => line.match(/^(\w+)="?(.*?)"?$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value])
)
const URL_ = status.API_URL
const KEY = status.PUBLISHABLE_KEY
const client = () => createClient(URL_, KEY, { auth: { persistSession: false, autoRefreshToken: false } })

let failures = 0
const check = (name, ok, detail = "") => {
  if (!ok) failures++
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`)
}

async function signUp(email, role, name) {
  const c = client()
  const { data, error } = await c.auth.signUp({ email, password: "testpass123", options: { data: { role, display_name: name } } })
  if (error) throw error
  return { c, id: data.user.id }
}

const stamp = Date.now()
const brand = await signUp(`brand-${stamp}@example.test`, "brand", "Fitline Sportswear")
const creator = await signUp(`creator-${stamp}@example.test`, "creator", "Maya Koleva")
const stranger = await signUp(`stranger-${stamp}@example.test`, "creator", "Someone Else")
const anon = client()

// Profiles and contacts
const { data: anonProfile } = await anon.from("profiles").select().eq("id", creator.id).maybeSingle()
check("signup trigger created the profile, readable logged out", anonProfile?.display_name === "Maya Koleva")
const { data: anonContacts } = await anon.from("contacts").select().eq("id", creator.id)
check("logged-out visitors can't read contacts", anonContacts?.length === 0)
const { data: ownContacts } = await creator.c.from("contacts").select().eq("id", creator.id).maybeSingle()
check("owners read their own contacts", ownContacts?.email === `creator-${stamp}@example.test`)
const { data: strangerContacts } = await stranger.c.from("contacts").select().eq("id", creator.id)
check("strangers can't read contacts", strangerContacts?.length === 0)

const { error: roleError } = await creator.c.from("profiles").update({ role: "brand" }).eq("id", creator.id)
check("role can't be changed", Boolean(roleError), roleError?.code)
const { data: otherEdit } = await stranger.c.from("profiles").update({ headline: "hacked" }).eq("id", creator.id).select()
check("can't edit someone else's profile", otherEdit?.length === 0)

// Connections
const { error: sameRole } = await stranger.c.from("connections").insert({ from_id: stranger.id, to_id: creator.id })
check("creators can't connect with creators", Boolean(sameRole), sameRole?.code)
const { error: forged } = await stranger.c.from("connections").insert({ from_id: brand.id, to_id: creator.id })
check("can't send a request as someone else", Boolean(forged), forged?.code)
const { data: conn, error: connError } = await creator.c.from("connections").insert({ from_id: creator.id, to_id: brand.id, note: "Hi" }).select().single()
check("creator sends a request to a brand", !connError, connError?.message)
const { data: selfAccept } = await creator.c.from("connections").update({ status: "accepted" }).eq("id", conn.id).select()
check("sender can't accept their own request", selfAccept?.length === 0)

const { error: earlyPartnership } = await brand.c.from("partnerships").insert({ creator_id: creator.id, brand_id: brand.id, created_by: brand.id, title: "Early", code: "EARLY1" })
check("no partnership before the connection is accepted", Boolean(earlyPartnership), earlyPartnership?.code)

const { error: acceptError } = await brand.c.from("connections").update({ status: "accepted" }).eq("id", conn.id)
check("recipient accepts", !acceptError, acceptError?.message)
const { data: brandSeesContacts } = await brand.c.from("contacts").select().eq("id", creator.id).maybeSingle()
check("accepted connection unlocks contacts", brandSeesContacts?.email === `creator-${stamp}@example.test`)

// Partnerships and results
const { data: partnership, error: pError } = await brand.c.from("partnerships").insert({ creator_id: creator.id, brand_id: brand.id, created_by: brand.id, title: "Spring", code: "MAYA10" }).select().single()
check("connected pair starts a partnership", !pError, pError?.message)
const { error: badCode } = await brand.c.from("partnerships").insert({ creator_id: creator.id, brand_id: brand.id, created_by: brand.id, title: "Bad", code: "lower case" })
check("invalid codes are rejected", Boolean(badCode), badCode?.code)
const { data: strangerPartnership } = await stranger.c.from("partnerships").select().eq("id", partnership.id)
check("strangers can't see the partnership", strangerPartnership?.length === 0)
const { error: codeEdit } = await creator.c.from("partnerships").update({ code: "HACKED" }).eq("id", partnership.id)
check("partnership code can't be edited", Boolean(codeEdit), codeEdit?.code)

const { error: rError } = await creator.c.from("results").insert({ partnership_id: partnership.id, created_by: creator.id, date: "2026-11-03", sales: 12, revenue: 540, earnings: 81 })
check("participant logs a result", !rError, rError?.message)
const { error: strangerResult } = await stranger.c.from("results").insert({ partnership_id: partnership.id, created_by: stranger.id, date: "2026-11-03", sales: 1, revenue: 1, earnings: 1 })
check("strangers can't log results", Boolean(strangerResult), strangerResult?.code)
const { data: brandResults } = await brand.c.from("results").select().eq("partnership_id", partnership.id)
check("both sides see results", brandResults?.length === 1 && Number(brandResults[0].revenue) === 540)

// Export and deletion
const { data: exported, error: exportError } = await creator.c.rpc("export_my_data")
check("export contains account, profile and partnerships", !exportError && exported?.profile?.id === creator.id && exported?.partnerships?.length === 1 && exported?.results?.length === 1)
const { error: anonDelete } = await anon.rpc("delete_my_account")
check("logged-out visitors can't call delete", Boolean(anonDelete), anonDelete?.code)

const { error: deleteError } = await creator.c.rpc("delete_my_account")
check("creator deletes their account", !deleteError, deleteError?.message)
const { data: goneProfile } = await anon.from("profiles").select().eq("id", creator.id)
check("profile is gone", goneProfile?.length === 0)
const { data: brandConnections } = await brand.c.from("connections").select().eq("id", conn.id)
check("connection is gone", brandConnections?.length === 0)
const { data: keptPartnership } = await brand.c.from("partnerships").select().eq("id", partnership.id).maybeSingle()
check("brand keeps the partnership, creator side anonymised", keptPartnership?.creator_id === null && keptPartnership?.brand_id === brand.id)
const { data: keptResults } = await brand.c.from("results").select().eq("partnership_id", partnership.id)
check("results stay, author anonymised", keptResults?.length === 1 && keptResults[0].created_by === null)
const { error: signInDeleted } = await client().auth.signInWithPassword({ email: `creator-${stamp}@example.test`, password: "testpass123" })
check("deleted account can't sign in", Boolean(signInDeleted), signInDeleted?.code)

await brand.c.rpc("delete_my_account")
const { count } = await stranger.c.from("partnerships").select("*", { count: "exact", head: true }).eq("id", partnership.id)
const { data: adminLeft } = await anon.from("profiles").select().eq("id", brand.id)
check("brand deletion also removes the now-empty partnership", adminLeft?.length === 0 && count === 0)
await stranger.c.rpc("delete_my_account")

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed")
process.exit(failures ? 1 : 0)
