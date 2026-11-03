import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { Onest, Plus_Jakarta_Sans } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import "../globals.css"
import { routing } from "@/i18n/routing"
import Providers from "@/components/Providers"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"

// Plus Jakarta Sans has no Cyrillic, so Bulgarian pages use Onest throughout (see globals.css).
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })
const onest = Onest({ subsets: ["cyrillic", "latin"], variable: "--font-onest" })

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return { title: t("title"), description: t("description") }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${jakarta.variable} ${onest.variable}`}>
      <body className="font-sans">
        <NextIntlClientProvider>
          <Providers>
            <SiteHeader />
            {children}
            <SiteFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
