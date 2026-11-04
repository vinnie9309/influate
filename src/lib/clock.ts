import { useSyncExternalStore } from "react"

// The current date is outside React's control, so components read it from this
// external store instead of calling `new Date()` while rendering. It ticks at local midnight.

/** Local date as YYYY-MM-DD. */
const localDate = (): string => new Date().toLocaleDateString("en-CA")

function subscribe(onChange: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>
  const scheduleNextMidnight = () => {
    const now = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    timer = setTimeout(() => {
      onChange()
      scheduleNextMidnight()
    }, midnight.getTime() - now.getTime())
  }
  scheduleNextMidnight()
  return () => clearTimeout(timer)
}

/** Today's local date as YYYY-MM-DD; re-renders subscribers when the day changes. */
export const useToday = (): string => useSyncExternalStore(subscribe, localDate, localDate)

/** The current month as YYYY-MM. */
export const useCurrentMonth = (): string => useToday().slice(0, 7)
