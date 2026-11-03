import { useTranslations } from "next-intl"
import { CATEGORIES, FOLLOWER_RANGES, PLATFORMS, type Category, type FollowerRange, type Platform } from "./constants"

const isOneOf = <T extends string>(list: readonly T[], value: string): value is T => (list as readonly string[]).includes(value)

/**
 * Translated labels for stored option values. Values that aren't in the known lists
 * (e.g. data saved before a list changed) are shown as they are.
 */
export function useOptionLabels() {
  const categories = useTranslations("Categories")
  const platforms = useTranslations("Platforms")
  const followers = useTranslations("Followers")
  return {
    category: (value: string) => (isOneOf<Category>(CATEGORIES, value) ? categories(value) : value),
    platform: (value: string) => (isOneOf<Platform>(PLATFORMS, value) ? platforms(value) : value),
    followers: (value: string) => (isOneOf<FollowerRange>(FOLLOWER_RANGES, value) ? followers(value) : value)
  }
}
