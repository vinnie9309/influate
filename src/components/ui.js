import Link from "next/link"
import { initials } from "@/lib/constants"

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"
const buttonSizes = { md: "h-11 px-[18px] text-[15px]", lg: "h-[52px] px-[22px] text-base", sm: "h-9 px-3 text-sm" }
const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  dark: "bg-ink text-paper hover:bg-black",
  outline: "bg-white text-ink border border-line-strong hover:bg-mist",
  ghost: "text-ink hover:bg-mist",
  soft: "bg-mist text-subtle hover:bg-line",
  danger: "bg-white text-danger border border-line-strong hover:bg-danger-soft"
}

export function Button({ href, variant = "primary", size = "md", className = "", ...props }) {
  const classes = `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`
  if (href) return <Link href={href} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}

export function Card({ className = "", ...props }) {
  return <div className={`rounded-[20px] border border-line bg-white ${className}`} {...props} />
}

const inputClasses =
  "w-full rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"

export function Field({ label, id, hint, as = "input", options, className = "", ...props }) {
  let control
  if (as === "textarea") control = <textarea id={id} className={`${inputClasses} min-h-[110px] py-3`} {...props} />
  else if (as === "select")
    control = (
      <select id={id} className={`${inputClasses} h-12`} {...props}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )
  else control = <input id={id} className={`${inputClasses} h-12`} {...props} />
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-subtle">
        {label}
      </label>
      {control}
      {hint && <p className="text-[13px] text-muted">{hint}</p>}
    </div>
  )
}

export function ChipToggle({ selected, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`h-10 rounded-full px-3.5 text-sm font-semibold transition-colors ${
        selected ? "bg-ink text-paper" : "border border-line-strong bg-white text-subtle hover:bg-mist"
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Tag({ children, tone = "mist" }) {
  const tones = {
    mist: "bg-mist text-subtle",
    brand: "bg-brand-soft text-brand-dark",
    sun: "bg-sun-soft text-sun-ink",
    dark: "bg-ink text-paper"
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

const avatarTones = ["bg-brand-soft text-brand-dark", "bg-[#FCE7DC] text-[#8A3B12]", "bg-[#E6E9FB] text-[#2F3A8F]", "bg-sun-soft text-sun-ink"]

export function Avatar({ name, role, size = 48 }) {
  const tone = avatarTones[(name || "").length % avatarTones.length]
  const shape = role === "brand" ? "rounded-[30%]" : "rounded-full"
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      className={`inline-flex shrink-0 items-center justify-center font-extrabold ${shape} ${tone}`}
    >
      {initials(name)}
    </span>
  )
}

export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow && <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{eyebrow}</span>}
      <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">{title}</h1>
      {children && <p className="max-w-2xl text-base leading-relaxed text-body">{children}</p>}
    </div>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
      {children}
    </p>
  )
}

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
      {label}
    </div>
  )
}
