"use client"
import { Suspense, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Link, redirect } from "@/i18n/navigation"
import { useAuth } from "@/lib/queries"
import { supabase } from "@/lib/supabase"
import AuthCard, { GoogleButton, authErrorKey, signInWithGoogle, type AuthErrorKey } from "@/components/AuthCard"
import { Button, ErrorNote, Field } from "@/components/ui"

/** Only follow local paths, never an absolute URL from the query string. */
const safeNext = (next: string | null): string => (next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard")

function LoginForm() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const params = useSearchParams()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<AuthErrorKey | null>(null)
  const [busy, setBusy] = useState(false)
  const next = safeNext(params.get("next"))

  if (!loading && user) redirect({ href: next, locale })

  const run = async (signIn: () => Promise<void>) => {
    setError(null)
    setBusy(true)
    try {
      await signIn()
    } catch (err) {
      setError(authErrorKey(err))
      setBusy(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void run(async () => {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
    })
  }

  return (
    <AuthCard
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
      footer={
        <>
          {t("newHere")}{" "}
          <Link href="/signup" className="font-semibold text-brand underline">
            {t("createProfile")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field id="email" type="email" label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <Field
          id="password"
          type="password"
          label={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <ErrorNote>{error && t(`errors.${error}`)}</ErrorNote>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? t("loggingIn") : t("logIn")}
        </Button>
      </form>
      <GoogleButton onClick={() => void run(() => signInWithGoogle(next, locale))} disabled={busy} />
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
