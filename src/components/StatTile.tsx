import type { ReactNode } from "react"

const variants = {
  /** Standalone white card, for stat rows. */
  card: "rounded-[20px] border border-line bg-white p-5",
  /** Tinted tile, for stats inside another card. */
  subtle: "rounded-2xl bg-paper p-4"
}

interface StatTileProps {
  label: string
  value: ReactNode
  variant?: keyof typeof variants
}

/** A label over a large number. */
export default function StatTile({ label, value, variant = "card" }: StatTileProps) {
  return (
    <div className={`flex flex-col gap-1 ${variants[variant]}`}>
      <span className="text-[13px] text-muted">{label}</span>
      <strong className="text-2xl font-extrabold tracking-[-0.02em] sm:text-[28px]">{value}</strong>
    </div>
  )
}
