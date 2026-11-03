"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import Logo from "./Logo"
import { Button } from "./ui"

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" }
]

const marketingLinks = [
  { href: "/#creators", label: "For creators" },
  { href: "/#brands", label: "For brands" },
  { href: "/#how", label: "How it works" }
]

export default function SiteHeader() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const links = user ? appLinks : marketingLinks

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/")
  }

  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-6">
      <Logo href={user ? "/dashboard" : "/"} />
      <nav aria-label="Main" className="flex flex-wrap gap-7 text-[15px] font-medium">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname === l.href ? "page" : undefined}
            className={pathname === l.href ? "text-ink" : "text-subtle hover:text-ink"}
          >
            {l.label}
          </Link>
        ))}
        {profile && (
          <Link
            href={`/u/${profile.uid}`}
            className={pathname === `/u/${profile.uid}` ? "text-ink" : "text-subtle hover:text-ink"}
          >
            My profile
          </Link>
        )}
      </nav>
      <div className="flex gap-2.5">
        {user ? (
          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        ) : (
          <>
            <Button href="/login" variant="ghost">
              Log in
            </Button>
            <Button href="/signup" variant="dark">
              Join free
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
