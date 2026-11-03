import type { Metadata } from "next"
import { use } from "react"
import { setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"
import { privacyPolicy } from "@/content/legal"
import LegalPage from "@/components/LegalPage"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, description } = privacyPolicy[(await params).locale]
  return { title: `${title} — Influate`, description }
}

export default function PrivacyPage({ params }: Props) {
  const { locale } = use(params)
  setRequestLocale(locale)
  return <LegalPage doc={privacyPolicy[locale]} />
}
