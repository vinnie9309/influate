import type { Metadata } from "next"
import { use } from "react"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import LegalPage, { LegalValue, List, P, Section, Table } from "@/components/LegalPage"

export const metadata: Metadata = {
  title: "Cookie policy — Influate",
  description: "Which cookies and browser storage Influate uses, why, and how to control them."
}

const contents = [
  { id: "summary", title: "Summary" },
  { id: "what", title: "Cookies and browser storage" },
  { id: "ours", title: "What Influate stores" },
  { id: "third-party", title: "Third parties" },
  { id: "control", title: "Managing storage" },
  { id: "changes", title: "Changes" }
] as const

export default function CookiesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale(use(params).locale)
  return (
    <LegalPage
      title="Cookie policy"
      contents={contents}
      intro={
        <P>
          This policy explains what Influate stores in your browser and why. It complements our{" "}
          <Link href="/privacy" className="font-semibold">
            privacy policy
          </Link>
          .
        </P>
      }
    >
      <Section id="summary" title="Summary">
        <List
          items={[
            "We do not use advertising, analytics or tracking cookies.",
            "We only store what is strictly necessary to keep you signed in and to run the app, so we don't ask for consent.",
            "Our fonts are served from our own domain, so loading a page sends nothing to font providers."
          ]}
        />
      </Section>

      <Section id="what" title="Cookies and browser storage">
        <P>
          Cookies are small files a website saves in your browser. Similar technologies, such as IndexedDB and local
          storage, keep data in your browser in the same way. EU law treats them alike: storage that is strictly
          necessary for a service you asked for needs no consent, while anything else, such as analytics or
          advertising, does.
        </P>
      </Section>

      <Section id="ours" title="What Influate stores">
        <Table
          head={["Name", "Type", "Purpose", "Duration", "Category"]}
          rows={[
            [
              <code key="n">firebaseLocalStorageDb</code>,
              "IndexedDB",
              "Keeps you signed in between visits (Firebase Authentication session)",
              "Until you sign out or clear site data",
              "Strictly necessary"
            ],
            [
              <code key="n">firebase-heartbeat-database</code>,
              "IndexedDB",
              "Records which Firebase SDK version the app uses, sent along with requests to Firebase to keep the service running",
              "Up to 30 days",
              "Strictly necessary"
            ]
          ]}
        />
        <P>
          Data the app loads while you use it, such as profiles and partnerships, is kept in memory only and is gone when
          you close the tab.
        </P>
      </Section>

      <Section id="third-party" title="Third parties">
        <List
          items={[
            <>
              <strong>Google sign-in:</strong> if you choose &quot;Continue with Google&quot;, Google opens a sign-in window
              and may set its own cookies on its domains. That is covered by Google&apos;s privacy policy, not ours.
            </>,
            <>
              <strong>Firebase sign-in helper:</strong> sign-in runs partly on a Firebase domain that may use its own
              browser storage to complete the sign-in.
            </>
          ]}
        />
        <P>
          If we ever add analytics or anything else that is not strictly necessary, we will ask for your consent first
          and update this page.
        </P>
      </Section>

      <Section id="control" title="Managing storage">
        <P>
          You can view and delete cookies and site data in your browser settings. Clearing Influate&apos;s site data signs
          you out; nothing else breaks. Blocking storage for our site entirely stops sign-in from working.
        </P>
      </Section>

      <Section id="changes" title="Changes">
        <P>
          We update this page whenever what we store changes. Questions? Email <LegalValue name="privacyEmail" />.
        </P>
      </Section>
    </LegalPage>
  )
}
