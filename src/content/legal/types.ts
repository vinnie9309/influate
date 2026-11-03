import type { ReactNode } from "react"

export interface LegalSection {
  /** Anchor for the table of contents. */
  id: string
  title: string
  body: ReactNode
}

/** One legal page in one language. */
export interface LegalDocument {
  title: string
  description: string
  intro: ReactNode
  sections: readonly LegalSection[]
}
