// Facts the privacy and cookie policies depend on. Anything still in [BRACKETS] is shown
// highlighted on the pages until it is filled in.

export const LEGAL = {
  company: "[COMPANY LEGAL NAME]",
  registrationNumber: "[ЕИК / COMPANY REGISTRATION NUMBER]",
  address: "[REGISTERED ADDRESS]",
  privacyEmail: "[PRIVACY CONTACT EMAIL]",
  /** Supabase dashboard → Project settings → General → Region (must be an EU region). */
  dataRegion: "Frankfurt, Germany (AWS eu-central-1)",
  /** Supabase dashboard → Database → Backups; depends on the plan. */
  backupDays: "[BACKUP RETENTION IN DAYS]",
  /** Names the browser storage key on the cookie page. */
  supabaseProjectRef: "eqyfewqbbxblacvktbdf",
  minimumAge: 16,
  /** ISO date, formatted per language on the pages. */
  lastUpdated: "2026-11-03"
} as const

export type LegalKey = keyof typeof LEGAL

export const isPlaceholder = (value: string | number): boolean => typeof value === "string" && /^\[.*\]$/.test(value)

/** Where Supabase keeps the signed-in session in the browser (supabase-js default key). */
export const SESSION_STORAGE_KEY = `sb-${LEGAL.supabaseProjectRef}-auth-token`
