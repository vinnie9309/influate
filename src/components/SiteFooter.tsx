import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export default function SiteFooter() {
  const t = useTranslations("Footer")
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-7 text-sm text-muted">
        <span>{t("tagline")}</span>
        <nav aria-label={t("legal")} className="flex gap-5">
          <Link href="/privacy" className="hover:text-ink">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="hover:text-ink">
            {t("cookies")}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
