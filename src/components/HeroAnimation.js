// Creators (left) connect to brands (right); an affiliate code travels each link
// and the brand lights up, then an earnings card rises. Pure SVG + CSS (see globals.css).

const links = [
  { d: "M100 80 C 260 80, 260 200, 422 200", code: "MAYA10", chip: [222, 126], ring: [412, 162], delay: "" },
  { d: "M100 200 C 260 200, 260 320, 422 320", code: "DANI15", chip: [222, 247], ring: [412, 282], delay: "fx-d2" },
  { d: "M100 320 C 260 320, 260 80, 422 80", code: "IVA20", chip: [222, 170], ring: [412, 42], delay: "fx-d3" }
]

const creators = [
  { y: 80, label: "MK", fill: "#E3F1EA", text: "#155C43" },
  { y: 200, label: "DP", fill: "#FCE7DC", text: "#8A3B12" },
  { y: 320, label: "IS", fill: "#E6E9FB", text: "#2F3A8F" }
]

const brands = [
  { y: 52, label: "Br", fill: "#14201C", text: "#F7F8F5" },
  { y: 172, label: "Fi", fill: "#1F7A5A", text: "#FFFFFF" },
  { y: 292, label: "Ve", fill: "#F2B544", text: "#14201C" }
]

export default function HeroAnimation() {
  return (
    <div className="relative rounded-3xl border border-line bg-white p-6 shadow-float">
      <div className="flex justify-between px-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
        <span>Creators</span>
        <span>Brands</span>
      </div>
      <svg
        viewBox="0 0 520 400"
        className="block h-auto w-full"
        role="img"
        aria-label="Creators connect to brands and affiliate codes travel between them"
      >
        <g fill="none" stroke="#E2E8E4" strokeWidth="2" strokeDasharray="4 6">
          {links.map((l) => (
            <path key={l.code} d={l.d} />
          ))}
        </g>
        <g fill="none" stroke="#1F7A5A" strokeWidth="3" strokeLinecap="round">
          {links.map((l) => (
            <path key={l.code} className={`fx-draw ${l.delay}`} pathLength="100" d={l.d} />
          ))}
        </g>
        <g fill="none" stroke="#F2B544" strokeWidth="12" strokeLinecap="round">
          {links.map((l) => (
            <path key={l.code} className={`fx-dot ${l.delay}`} pathLength="100" d={l.d} />
          ))}
        </g>
        <g fontSize="12" fontWeight="700" textAnchor="middle">
          {links.map((l) => (
            <g key={l.code} className={`fx-chip ${l.delay}`}>
              <rect x={l.chip[0]} y={l.chip[1]} width="78" height="26" rx="13" fill="#FFF4DC" stroke="#F2B544" />
              <text x={l.chip[0] + 39} y={l.chip[1] + 17} fill="#7A5300">
                {l.code}
              </text>
            </g>
          ))}
        </g>
        <g fill="none" stroke="#1F7A5A" strokeWidth="3">
          {links.map((l) => (
            <rect key={l.code} className={`fx-ring ${l.delay}`} x={l.ring[0]} y={l.ring[1]} width="76" height="76" rx="20" />
          ))}
        </g>
        <g fontSize="15" fontWeight="700" textAnchor="middle">
          {creators.map((c) => (
            <g key={c.label}>
              <circle cx="70" cy={c.y} r="30" fill={c.fill} />
              <text x="70" y={c.y + 5} fill={c.text}>
                {c.label}
              </text>
            </g>
          ))}
          {brands.map((b) => (
            <g key={b.label}>
              <rect x="422" y={b.y} width="56" height="56" rx="14" fill={b.fill} />
              <text x="450" y={b.y + 33} fill={b.text}>
                {b.label}
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
          <span className="text-xs text-[#A9BAB3]">Partnership earnings this month</span>
          <span className="text-2xl font-extrabold tracking-[-0.02em]">€1,240</span>
        </div>
        <span className="rounded-full bg-brand px-2.5 py-1.5 text-xs font-bold">3 active</span>
      </div>
    </div>
  )
}
