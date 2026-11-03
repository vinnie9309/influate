import Link from "next/link"

const links = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" }
] as const

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-7 text-sm text-muted">
        <span>© Influate · Partnerships for growing creators and brands</span>
        <nav aria-label="Legal" className="flex gap-5">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
