import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["bg", "en"],
  defaultLocale: "bg",
  // Bulgarian lives at "/", English under "/en".
  localePrefix: "as-needed",
  // Everyone starts in Bulgarian; switching is explicit and nothing is stored in a cookie.
  localeDetection: false,
  localeCookie: false
})

export type Locale = (typeof routing.locales)[number]
