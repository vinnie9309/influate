export const ROLES = {
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
]

export const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Facebook", "Twitch", "Blog", "Podcast"]

export const AUDIENCE_AGES = ["13–17", "18–24", "18–34", "25–34", "25–44", "35–54", "55+"]

export const FOLLOWER_RANGES = ["Under 1K", "1K–5K", "5K–10K", "10K–50K", "50K–100K", "100K+"]

export function otherRole(role) {
  return role === "creator" ? "brand" : "creator"
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "?"
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0)
}
