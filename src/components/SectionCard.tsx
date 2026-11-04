import type { ReactNode } from "react"
import { Card } from "./ui"

interface SectionCardProps {
  title: string
  description?: ReactNode
  /** Shown to the right of the title, e.g. a button. */
  action?: ReactNode
  className?: string
  children?: ReactNode
}

/** A titled white card: the standard block for page sections. */
export default function SectionCard({ title, description, action, className = "", children }: SectionCardProps) {
  return (
    <Card className={`flex flex-col gap-5 p-6 sm:p-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">{title}</h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  )
}
