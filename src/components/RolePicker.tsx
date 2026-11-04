import { useTranslations } from "next-intl"
import type { Role } from "@/lib/types"

const ROLE_KEYS = {
  creator: { title: "roleCreatorTitle", text: "roleCreatorText" },
  brand: { title: "roleBrandTitle", text: "roleBrandText" }
} as const

export default function RolePicker({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const t = useTranslations("Auth")
  return (
    <fieldset className="grid grid-cols-2 gap-3">
      <legend className="mb-1.5 text-sm font-semibold text-subtle">{t("roleQuestion")}</legend>
      {(Object.keys(ROLE_KEYS) as Role[]).map((role) => (
        <label
          key={role}
          className={`flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-colors ${
            value === role ? "border-brand bg-brand-soft" : "border-line-strong bg-white hover:bg-mist"
          }`}
        >
          <input type="radio" name="role" value={role} checked={value === role} onChange={() => onChange(role)} className="sr-only" />
          <span className="text-[15px] font-bold">{t(ROLE_KEYS[role].title)}</span>
          <span className="text-[13px] leading-snug text-body">{t(ROLE_KEYS[role].text)}</span>
        </label>
      ))}
    </fieldset>
  )
}
