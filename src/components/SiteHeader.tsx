"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { useQueryClient } from "@tanstack/react-query"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/queries"
import Logo from "./Logo"
import { Button } from "./ui"

interface NavLink {
  href: string
  label: string
}

const appLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" }
]

const marketingLinks: NavLink[] = [
  { href: "/#creators", label: "For creators" },
  { href: "/#brands", label: "For brands" },
  { href: "/#how", label: "How it works" }
]

export default function SiteHeader() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const links = user
    ? [...appLinks, ...(profile ? [{ href: `/u/${profile.uid}`, label: "My profile" }] : [])]
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
      <nav aria-label="Main" className="flex flex-wrap gap-7 text-[15px] font-medium">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={pathname === href ? "text-ink" : "text-subtle hover:text-ink"}
          >
            {label}
          </Link>
        ))}
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
