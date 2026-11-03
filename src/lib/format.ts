import { useFormatter } from "next-intl"

/** Formats whole-euro amounts in the current language (e.g. "€540" / "540 €"). */
export function useMoney(): (value: number) => string {
  const format = useFormatter()
  return (value) => format.number(value || 0, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}
