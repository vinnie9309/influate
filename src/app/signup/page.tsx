"use client"
import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile, type User } from "firebase/auth"
import { useQueryClient } from "@tanstack/react-query"
import { auth } from "@/lib/firebase"
import { getProfile } from "@/lib/data"
import { keys, useAuth, useCreateProfile } from "@/lib/queries"
import type { Role } from "@/lib/types"
import AuthCard, { GoogleButton, authErrorMessage, signInWithGoogle } from "@/components/AuthCard"
import RolePicker from "@/components/RolePicker"
import { Button, ErrorNote, Field } from "@/components/ui"

function SignupForm() {
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, loading } = useAuth()
  const createProfile = useCreateProfile()
  const [role, setRole] = useState<Role>(params.get("role") === "brand" ? "brand" : "creator")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  // Already signed in (and not mid-signup): nothing to do here.
  if (!loading && user && !busy) redirect("/dashboard")

  const finish = async (newUser: User, displayName: string) => {
    const existing = await queryClient.fetchQuery({ queryKey: keys.profile(newUser.uid), queryFn: () => getProfile(newUser.uid) })
    if (!existing) await createProfile.mutateAsync({ uid: newUser.uid, role, displayName, email: newUser.email })
    router.push("/profile/edit?welcome=1")
  }

  const run = async (signUp: () => Promise<void>) => {
    setError("")
    setBusy(true)
    try {
      await signUp()
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void run(async () => {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateAuthProfile(newUser, { displayName: name.trim() })
      await finish(newUser, name.trim())
    })
  }

  const handleGoogle = () =>
    void run(async () => {
      const newUser = await signInWithGoogle()
      await finish(newUser, newUser.displayName ?? "")
    })

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
        <Field id="email" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
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
