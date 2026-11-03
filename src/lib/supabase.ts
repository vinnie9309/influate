import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).")
}

// Browser client. The session lives in localStorage; row-level security in the database decides
// what each signed-in user may read and write.
export const supabase = createClient<Database>(url, publishableKey, {
  auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})
