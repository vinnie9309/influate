import type { Locale } from "@/i18n/routing"
import { cookiesBg } from "./cookies.bg"
import { cookiesEn } from "./cookies.en"
import { privacyBg } from "./privacy.bg"
import { privacyEn } from "./privacy.en"
import type { LegalDocument } from "./types"

export const privacyPolicy: Record<Locale, LegalDocument> = { bg: privacyBg, en: privacyEn }
export const cookiePolicy: Record<Locale, LegalDocument> = { bg: cookiesBg, en: cookiesEn }
