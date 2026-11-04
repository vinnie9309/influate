"use client"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"

/** BG / EN toggle that keeps the current page (and its query string). */
export default function LanguageSwitcher() {
  const t = useTranslations("Nav")
  const current = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (locale: Locale) => router.replace(`${pathname}${window.location.search}`, { locale })

  return (
    <div className="flex rounded-lg bg-mist p-0.5" role="group" aria-label={t("language")}>
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          aria-pressed={current === locale}
          onClick={() => switchTo(locale)}
          className={`h-8 rounded-md px-2.5 text-xs font-bold uppercase ${current === locale ? "bg-white text-ink shadow-xs" : "text-muted hover:text-ink"}`}
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
