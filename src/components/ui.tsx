import type { ComponentProps, ReactNode } from "react"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { initials } from "@/lib/constants"
import type { Role } from "@/lib/types"

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

interface ButtonStyle {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  className?: string
}

type ButtonProps =
  | (ButtonStyle & Omit<ComponentProps<typeof Link>, "className">)
  | (ButtonStyle & Omit<ComponentProps<"button">, "className"> & { href?: undefined })

/** A button, or a link styled as one when `href` is given. */
export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const classes = `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`
  if (props.href !== undefined) return <Link {...props} className={classes} />
  return <button type="button" {...props} className={classes} />
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-[20px] border border-line bg-white ${className}`} {...props} />
}

const inputClasses =
  "rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20"

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  className?: string
  children: ReactNode
}

function FieldShell({ id, label, hint, className = "", children }: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-subtle">
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-muted">{hint}</p>}
    </div>
  )
}

type ShellProps = Omit<FieldShellProps, "children">

export function Field({ id, label, hint, className, ...input }: ShellProps & Omit<ComponentProps<"input">, "id">) {
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <input id={id} className={`${inputClasses} h-12 w-full`} {...input} />
    </FieldShell>
  )
}

export function TextAreaField({ id, label, hint, className, ...textarea }: ShellProps & Omit<ComponentProps<"textarea">, "id">) {
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <textarea id={id} className={`${inputClasses} min-h-[110px] w-full py-3`} {...textarea} />
    </FieldShell>
  )
}

interface SelectProps extends ComponentProps<"select"> {
  /** Stored values. */
  options: readonly string[]
  /** Shown text per value; defaults to the value itself. */
  optionLabel?: (value: string) => string
  placeholder?: string
}

/** A select with an empty first option, styled like the other inputs. Full width unless `className` sets a width. */
export function Select({ options, optionLabel = (o) => o, placeholder, className = "w-full", ...select }: SelectProps) {
  const t = useTranslations("Common")
  return (
    <select className={`${inputClasses} h-12 ${className}`} {...select}>
      <option value="">{placeholder ?? t("select")}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {optionLabel(o)}
        </option>
      ))}
    </select>
  )
}

export function SelectField({ id, label, hint, className, ...select }: ShellProps & Omit<SelectProps, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <Select id={id} {...select} />
    </FieldShell>
  )
}

/** A search box with a leading icon; `label` is read by screen readers. */
export function SearchInput({ label, className = "", ...input }: { label?: string } & ComponentProps<"input">) {
  const t = useTranslations("Common")
  return (
    <label className={`flex h-12 min-w-0 items-center gap-2.5 rounded-xl border border-line-strong bg-white px-3.5 ${className}`}>
      <Search aria-hidden="true" className="h-[18px] w-[18px] text-muted" />
      <span className="sr-only">{label ?? t("search")}</span>
      <input type="search" className="min-w-0 flex-1 bg-transparent text-[15px] outline-hidden" {...input} />
    </label>
  )
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** A row of mutually exclusive toggle buttons. */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-xl bg-mist p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-10 rounded-lg px-4 text-sm font-bold ${value === o.value ? "bg-white text-ink shadow-xs" : "text-muted"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ChipToggle({ selected, children, ...props }: { selected: boolean } & ComponentProps<"button">) {
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

const tagTones = {
  mist: "bg-mist text-subtle",
  brand: "bg-brand-soft text-brand-dark",
  sun: "bg-sun-soft text-sun-ink",
  dark: "bg-ink text-paper"
}

export function Tag({ children, tone = "mist" }: { children: ReactNode; tone?: keyof typeof tagTones }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tagTones[tone]}`}>{children}</span>
}

const avatarTones = [
  "bg-brand-soft text-brand-dark",
  "bg-[#FCE7DC] text-[#8A3B12]",
  "bg-[#E6E9FB] text-[#2F3A8F]",
  "bg-sun-soft text-sun-ink"
]

export function Avatar({ name = "", role, size = 48 }: { name?: string; role?: Role; size?: number }) {
  const tone = avatarTones[name.length % avatarTones.length]
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

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow && <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">{eyebrow}</span>}
      <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[40px]">{title}</h1>
      {children && <p className="max-w-2xl text-base leading-relaxed text-body">{children}</p>}
    </div>
  )
}

export function ErrorNote({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
      {children}
    </p>
  )
}

export function Spinner({ label }: { label?: string }) {
  const t = useTranslations("Common")
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
      {label ?? t("loading")}
    </div>
  )
}
