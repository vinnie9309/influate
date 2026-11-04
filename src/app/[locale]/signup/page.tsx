"use client"
import { Suspense, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { Link, getPathname, redirect, useRouter } from "@/i18n/navigation"
import { LEGAL } from "@/lib/legal"
import { useAuth } from "@/lib/queries"
import { supabase } from "@/lib/supabase"
import type { Role } from "@/lib/types"
import AuthCard, { GoogleButton, authErrorKey, signInWithGoogle, type AuthErrorKey } from "@/components/AuthCard"
import RolePicker from "@/components/RolePicker"
import { Button, ErrorNote, Field } from "@/components/ui"

const AFTER_SIGNUP = "/profile/edit?welcome=1"

function SignupForm() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, loading } = useAuth()
  const [role, setRole] = useState<Role>(params.get("role") === "brand" ? "brand" : "creator")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<AuthErrorKey | null>(null)
  const [busy, setBusy] = useState(false)
  /** Set when the project requires email confirmation before the first sign-in. */
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null)

  // Already signed in (and not mid-signup): nothing to do here.
  if (!loading && user && !busy) redirect({ href: "/dashboard", locale })

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
      // The role and name travel as user metadata; a database trigger creates the profile from them.
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, display_name: name.trim() },
          emailRedirectTo: `${window.location.origin}${getPathname({ href: AFTER_SIGNUP, locale })}`
        }
      })
      if (signUpError) throw signUpError
      if (!data.session) {
        setConfirmationSentTo(email)
        setBusy(false)
        return
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      router.push(AFTER_SIGNUP)
    })
  }

  // Google users pick their role on the profile page after coming back.
  const handleGoogle = () => void run(() => signInWithGoogle(AFTER_SIGNUP, locale))

  if (confirmationSentTo) {
    return (
      <AuthCard title={t("checkEmailTitle")} subtitle={t("checkEmailText", { email: confirmationSentTo })}>
        <Button href="/login" variant="outline">
          {t("logIn")}
        </Button>
      </AuthCard>
    )
  }

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
          maxLength={80}
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
