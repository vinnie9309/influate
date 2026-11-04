import { useFormatter, useTranslations } from "next-intl"

// Creators (left) connect to brands (right); an affiliate code travels each link
// and the brand lights up, then an earnings card rises. Pure SVG + CSS (see globals.css).

type Point = readonly [x: number, y: number]

interface HeroLink {
  d: string
  code: string
  chip: Point
  ring: Point
  delay: "" | "fx-d2" | "fx-d3"
}

interface GraphNode {
  y: number
  label: string
  fill: string
  text: string
}

const links: readonly HeroLink[] = [
  { d: "M100 80 C 260 80, 260 200, 422 200", code: "MAYA10", chip: [222, 126], ring: [412, 162], delay: "" },
  { d: "M100 200 C 260 200, 260 320, 422 320", code: "DANI15", chip: [222, 247], ring: [412, 282], delay: "fx-d2" },
  { d: "M100 320 C 260 320, 260 80, 422 80", code: "IVA20", chip: [222, 170], ring: [412, 42], delay: "fx-d3" }
]

const creators: readonly GraphNode[] = [
  { y: 80, label: "MK", fill: "#E3F1EA", text: "#155C43" },
  { y: 200, label: "DP", fill: "#FCE7DC", text: "#8A3B12" },
  { y: 320, label: "IS", fill: "#E6E9FB", text: "#2F3A8F" }
]

const brands: readonly GraphNode[] = [
  { y: 52, label: "Br", fill: "#14201C", text: "#F7F8F5" },
  { y: 172, label: "Fi", fill: "#1F7A5A", text: "#FFFFFF" },
  { y: 292, label: "Ve", fill: "#F2B544", text: "#14201C" }
]

const SAMPLE_EARNINGS = 1240

export default function HeroAnimation() {
  const t = useTranslations("Hero")
  const format = useFormatter()
  return (
    <div className="relative rounded-3xl border border-line bg-white p-6 shadow-float">
      <div className="flex justify-between px-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
        <span>{t("creators")}</span>
        <span>{t("brands")}</span>
      </div>
      <svg viewBox="0 0 520 400" className="block h-auto w-full" role="img" aria-label={t("aria")}>
        <g fill="none" stroke="#E2E8E4" strokeWidth="2" strokeDasharray="4 6">
          {links.map(({ code, d }) => (
            <path key={code} d={d} />
          ))}
        </g>
        <g fill="none" stroke="#1F7A5A" strokeWidth="3" strokeLinecap="round">
          {links.map(({ code, d, delay }) => (
            <path key={code} className={`fx-draw ${delay}`} pathLength={100} d={d} />
          ))}
        </g>
        <g fill="none" stroke="#F2B544" strokeWidth="12" strokeLinecap="round">
          {links.map(({ code, d, delay }) => (
            <path key={code} className={`fx-dot ${delay}`} pathLength={100} d={d} />
          ))}
        </g>
        <g fontSize="12" fontWeight="700" textAnchor="middle">
          {links.map(({ code, chip: [x, y], delay }) => (
            <g key={code} className={`fx-chip ${delay}`}>
              <rect x={x} y={y} width="78" height="26" rx="13" fill="#FFF4DC" stroke="#F2B544" />
              <text x={x + 39} y={y + 17} fill="#7A5300">
                {code}
              </text>
            </g>
          ))}
        </g>
        <g fill="none" stroke="#1F7A5A" strokeWidth="3">
          {links.map(({ code, ring: [x, y], delay }) => (
            <rect key={code} className={`fx-ring ${delay}`} x={x} y={y} width="76" height="76" rx="20" />
          ))}
        </g>
        <g fontSize="15" fontWeight="700" textAnchor="middle">
          {creators.map(({ y, label, fill, text }) => (
            <g key={label}>
              <circle cx="70" cy={y} r="30" fill={fill} />
              <text x="70" y={y + 5} fill={text}>
                {label}
              </text>
            </g>
          ))}
          {brands.map(({ y, label, fill, text }) => (
            <g key={label}>
              <rect x="422" y={y} width="56" height="56" rx="14" fill={fill} />
              <text x="450" y={y + 33} fill={text}>
                {label}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <div
        aria-hidden="true"
        className="fx-card absolute -bottom-7 left-1/2 ml-[-150px] flex w-[300px] items-center justify-between gap-3 rounded-2xl bg-ink px-[18px] py-4 text-paper shadow-card"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#A9BAB3]">{t("earnings")}</span>
          <span className="text-2xl font-extrabold tracking-[-0.02em]">
            {format.number(SAMPLE_EARNINGS, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
          </span>
        </div>
        <span className="rounded-full bg-brand px-2.5 py-1.5 text-xs font-bold">{t("active", { count: 3 })}</span>
      </div>
    </div>
  )
}
