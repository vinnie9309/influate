import Link from "next/link"

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-ink no-underline">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#1F7A5A" />
        <circle cx="11" cy="16" r="4" fill="#F7F8F5" />
        <rect x="17" y="12" width="8" height="8" rx="2" fill="#F2B544" />
        <path d="M15 16h2" stroke="#F7F8F5" strokeWidth="2" />
      </svg>
      <span className="text-xl font-extrabold tracking-[-0.02em]">Influate</span>
    </Link>
  )
}
