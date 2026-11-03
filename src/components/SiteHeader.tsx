"use client"
import { signOut } from "firebase/auth"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/queries"
import LanguageSwitcher from "./LanguageSwitcher"
import Logo from "./Logo"
import { Button } from "./ui"

type NavKey = "dashboard" | "discover" | "myProfile" | "forCreators" | "forBrands" | "howItWorks"

const appLinks: readonly { href: string; key: NavKey }[] = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/discover", key: "discover" }
]

const marketingLinks: readonly { href: string; key: NavKey }[] = [
  { href: "/#creators", key: "forCreators" },
  { href: "/#brands", key: "forBrands" },
  { href: "/#how", key: "howItWorks" }
]

export default function SiteHeader() {
  const t = useTranslations("Nav")
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const links = user
    ? [...appLinks, ...(profile ? [{ href: `/u/${profile.uid}`, key: "myProfile" as const }] : [])]
    : marketingLinks

  const handleSignOut = async () => {
    await signOut(auth)
    // Cached reads belong to the previous user.
    queryClient.clear()
    router.push("/")
  }

  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-6">
      <Logo href={user ? "/dashboard" : "/"} />
      <nav aria-label={t("main")} className="flex flex-wrap gap-7 text-[15px] font-medium">
        {links.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={pathname === href ? "text-ink" : "text-subtle hover:text-ink"}
          >
            {t(key)}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <LanguageSwitcher />
        {user ? (
          <Button variant="ghost" onClick={handleSignOut}>
            {t("signOut")}
          </Button>
        ) : (
          <>
            <Button href="/login" variant="ghost">
              {t("logIn")}
            </Button>
            <Button href="/signup" variant="dark">
              {t("joinFree")}
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
