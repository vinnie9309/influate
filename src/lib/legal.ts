// Details the privacy and cookie policies depend on. Fill in every [BRACKETED] value
// before launch; the pages highlight anything still in brackets.

export const LEGAL = {
  company: "[COMPANY LEGAL NAME]",
  registrationNumber: "[COMPANY REGISTRATION NUMBER / ЕИК]",
  address: "[REGISTERED ADDRESS]",
  privacyEmail: "[PRIVACY CONTACT EMAIL]",
  /** Cloud Firestore location, from Firebase console → Firestore → Settings (e.g. "eur3 (Europe)"). */
  firestoreLocation: "[FIRESTORE LOCATION]",
  supervisoryAuthority: "Commission for Personal Data Protection (Bulgaria), cpdp.bg",
  minimumAge: 16,
  /** Days until a deleted account's data is erased from live systems. */
  deletionDays: 30,
  lastUpdated: "3 November 2026"
} as const

export const isPlaceholder = (value: string | number): boolean => typeof value === "string" && /^\[.*\]$/.test(value)
