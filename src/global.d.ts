import type { Locale } from "@/i18n/routing"
import type messages from "../messages/en.json"

// Typed translation keys: a key missing from en.json is a type error.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale
    Messages: typeof messages
  }
}
