"use client"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import AuthCard, { GoogleButton, authErrorMessage, signInWithGoogle } from "@/components/AuthCard"
import { Button, ErrorNote, Field } from "@/components/ui"

function LoginForm() {
  const params = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  // Only follow local paths, never an absolute URL from the query string.
  const next = params.get("next")?.startsWith("/") && !params.get("next").startsWith("//") ? params.get("next") : "/dashboard"

  useEffect(() => {
    if (!loading && user) router.replace(next)
  }, [loading, user, next, router])

  const run = async (signIn) => {
    setError("")
    setBusy(true)
    try {
      await signIn()
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    run(() => signInWithEmailAndPassword(auth, email, password))
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your partnerships and requests."
      footer={
        <>
          New to Influate?{" "}
          <Link href="/signup" className="font-semibold text-brand underline">
            Create a profile
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Field
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <GoogleButton onClick={() => run(signInWithGoogle)} disabled={busy} />
    </AuthCard>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
