"use client"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { createProfile, getProfile } from "@/lib/data"
import AuthCard, { GoogleButton, authErrorMessage, signInWithGoogle } from "@/components/AuthCard"
import RolePicker from "@/components/RolePicker"
import { Button, ErrorNote, Field } from "@/components/ui"

function SignupForm() {
  const params = useSearchParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [role, setRole] = useState(params.get("role") === "brand" ? "brand" : "creator")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user && !busy) router.replace("/dashboard")
  }, [loading, user, busy, router])

  const finish = async (newUser, displayName) => {
    if (!(await getProfile(newUser.uid))) {
      await createProfile(newUser.uid, { role, displayName, email: newUser.email })
    }
    router.push("/profile/edit?welcome=1")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateAuthProfile(newUser, { displayName: name.trim() })
      await finish(newUser, name.trim())
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setBusy(true)
    try {
      const newUser = await signInWithGoogle()
      await finish(newUser, newUser.displayName ?? "")
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Create your profile"
      subtitle="Free to join. You can fill in the details after signing up."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <RolePicker value={role} onChange={setRole} />
        <Field
          id="name"
          label={role === "brand" ? "Company name" : "Your name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete={role === "brand" ? "organization" : "name"}
          required
        />
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
          hint="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
        <ErrorNote>{error}</ErrorNote>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <GoogleButton onClick={handleGoogle} disabled={busy} />
    </AuthCard>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
