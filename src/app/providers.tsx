"use client"
import { useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FirebaseError } from "firebase/app"

// Retrying a denied read never succeeds; anything else gets two more tries.
const shouldRetry = (failureCount: number, error: Error) =>
  failureCount < 2 && !(error instanceof FirebaseError && error.code === "permission-denied")

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: shouldRetry } } })
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
