import type { ReactNode } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LEGAL, isPlaceholder, type LegalKey } from "@/lib/legal"
import type { LegalDocument } from "@/content/legal/types"

// Building blocks for the legal texts in src/content/legal, plus the page that lays them out.

/** A value from LEGAL, highlighted while it is still a placeholder. */
export function LegalValue({ name }: { name: LegalKey }) {
  const value = LEGAL[name]
  if (!isPlaceholder(value)) return <>{value}</>
  return <mark className="rounded bg-sun-soft px-1 font-semibold text-sun-ink">{value}</mark>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-body">{children}</p>
}

export function List({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-body marker:text-brand">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function Table({ head, rows }: { head: readonly string[]; rows: readonly (readonly ReactNode[])[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-mist text-subtle">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 leading-relaxed text-body">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Renders a legal document with a table of contents built from its sections. */
export default function LegalPage({ doc }: { doc: LegalDocument }) {
  const t = useTranslations("Legal")
  const format = useFormatter()
  return (
    <main className="mx-auto flex max-w-[1200px] flex-wrap gap-10 px-6 pb-24 pt-4">
      <aside className="min-w-0 flex-[1_1_220px]">
        <nav aria-label={t("onThisPage")} className="flex flex-col gap-1 lg:sticky lg:top-6">
          <span className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{t("onThisPage")}</span>
          {doc.sections.map(({ id, title }) => (
            <a key={id} href={`#${id}`} className="rounded-lg px-2 py-1.5 text-sm text-subtle hover:bg-mist hover:text-ink">
              {title}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-1 border-t border-line pt-4 text-sm">
            <Link href="/privacy" className="px-2 py-1 text-subtle hover:text-ink">
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="px-2 py-1 text-subtle hover:text-ink">
              {t("cookies")}
            </Link>
          </div>
        </nav>
      </aside>
      <article className="flex min-w-0 flex-[999_1_560px] flex-col gap-10 rounded-3xl border border-line bg-white p-6 sm:p-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">{doc.title}</h1>
          <p className="text-sm text-muted">
            {t("lastUpdated", { date: format.dateTime(new Date(LEGAL.lastUpdated), { dateStyle: "long" }) })}
          </p>
          <div className="text-base leading-relaxed text-body">{doc.intro}</div>
        </header>
        {doc.sections.map(({ id, title, body }) => (
          <section key={id} id={id} className="flex scroll-mt-6 flex-col gap-3">
            <h2 className="text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
            {body}
          </section>
        ))}
      </article>
    </main>
  )
}
