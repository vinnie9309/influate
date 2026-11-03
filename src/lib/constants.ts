import type { Role } from "./types"

export const ROLES: Record<Role, { label: string; plural: string }> = {
  creator: { label: "Creator", plural: "Creators" },
  brand: { label: "Brand", plural: "Brands" }
}

export const CATEGORIES = [
  "Fitness",
  "Beauty",
  "Fashion",
  "Food",
  "Travel",
  "Tech",
  "Gaming",
  "Parenting",
  "Home",
  "Finance",
  "Education",
  "Lifestyle"
] as const

export const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Facebook", "Twitch", "Blog", "Podcast"] as const

export const AUDIENCE_AGES = ["13–17", "18–24", "18–34", "25–34", "25–44", "35–54", "55+"] as const

export const FOLLOWER_RANGES = ["Under 1K", "1K–5K", "5K–10K", "10K–50K", "50K–100K", "100K+"] as const

export const otherRole = (role: Role): Role => (role === "creator" ? "brand" : "creator")

export function initials(name = ""): string {
  const [first = "", second = ""] = name.trim().split(/\s+/)
  return (first.charAt(0) + second.charAt(0)).toUpperCase() || "?"
}

const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export const formatMoney = (value: number): string => money.format(value || 0)
