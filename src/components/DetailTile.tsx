import type { ReactNode } from "react"

/** A small label/value tile. Renders nothing when there is no value. */
export default function DetailTile({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null
  return (
    <div className="flex flex-col gap-1 rounded-[14px] bg-paper p-3.5">
      <span className="text-xs text-muted">{label}</span>
      <strong className="text-[15px]">{children}</strong>
    </div>
  )
}
