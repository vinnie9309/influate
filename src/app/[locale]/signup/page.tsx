"use client"
import { Suspense, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { createUserWithEmailAndPassword, updateProfile as updateAuthProfile, type User } from "firebase/auth"
import { useQueryClient } from "@tanstack/react-query"
import { Link, redirect, useRouter } from "@/i18n/navigation"
import { auth } from "@/lib/firebase"
import { getProfile } from "@/lib/data"
import { LEGAL } from "@/lib/legal"
import { keys, useAuth, useCreateProfile } from "@/lib/queries"
import type { Role } from "@/lib/types"
import AuthCard, { GoogleButton, authErrorKey, signInWithGoogle, type AuthErrorKey } from "@/components/AuthCard"
import RolePicker from "@/components/RolePicker"
import { Button, ErrorNote, Field } from "@/components/ui"

function SignupForm() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, loading } = useAuth()
  const createProfile = useCreateProfile()
  const [role, setRole] = useState<Role>(params.get("role") === "brand" ? "brand" : "creator")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<AuthErrorKey | null>(null)
  const [busy, setBusy] = useState(false)

  // Already signed in (and not mid-signup): nothing to do here.
  if (!loading && user && !busy) redirect({ href: "/dashboard", locale })

  const finish = async (newUser: User, displayName: string) => {
    const existing = await queryClient.fetchQuery({ queryKey: keys.profile(newUser.uid), queryFn: () => getProfile(newUser.uid) })
    if (!existing) await createProfile.mutateAsync({ uid: newUser.uid, role, displayName, email: newUser.email })
    router.push("/profile/edit?welcome=1")
  }

  const run = async (signUp: () => Promise<void>) => {
    setError(null)
    setBusy(true)
    try {
      await signUp()
    } catch (err) {
      setError(authErrorKey(err))
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
      title={t("signupTitle")}
      subtitle={t("signupSubtitle")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-brand underline">
            {t("logIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <RolePicker value={role} onChange={setRole} />
        <Field
          id="name"
          label={role === "brand" ? t("companyName") : t("yourName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete={role === "brand" ? "organization" : "name"}
          required
        />
        <Field id="email" type="email" label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <Field
          id="password"
          type="password"
          label={t("password")}
          hint={t("passwordHint")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
        <ErrorNote>{error && t(`errors.${error}`)}</ErrorNote>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? t("creating") : t("createAccount")}
        </Button>
      </form>
      <GoogleButton onClick={handleGoogle} disabled={busy} />
      <p className="text-center text-[13px] leading-relaxed text-muted">
        {t.rich("ageNotice", {
          age: LEGAL.minimumAge,
          link: (chunks) => (
            <Link href="/privacy" className="underline">
              {chunks}
            </Link>
          )
        })}
      </p>
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
