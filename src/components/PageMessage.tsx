import type { ReactNode } from "react"
import { PageTitle } from "./ui"

/** A whole-page message, e.g. "not found". */
export default function PageMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="mx-auto max-w-[960px] px-6 pb-24 pt-4">
      <PageTitle title={title}>{children}</PageTitle>
    </main>
  )
}
