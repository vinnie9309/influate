import { Link } from "@/i18n/navigation"
import { SESSION_STORAGE_KEY } from "@/lib/legal"
import { LegalValue, List, P, Table } from "@/components/LegalPage"
import type { LegalDocument } from "./types"

export const cookiesEn: LegalDocument = {
  title: "Cookie policy",
  description: "Which cookies and browser storage Influate uses, why, and how to control them.",
  intro: (
    <P>
      This policy explains what Influate stores in your browser and why. It complements our{" "}
      <Link href="/privacy" className="font-semibold">
        privacy policy
      </Link>
      .
    </P>
  ),
  sections: [
    {
      id: "summary",
      title: "Summary",
      body: (
        <List
          items={[
            "Influate sets no cookies.",
            "We use no advertising, analytics or tracking technology.",
            "The only thing we store in your browser keeps you signed in, so it is strictly necessary and needs no consent.",
            "The language you read the site in comes from the address (/en for English), not from stored data.",
            "Our fonts are served from our own domain, so loading a page sends nothing to font providers."
          ]}
        />
      )
    },
    {
      id: "what",
      title: "Cookies and browser storage",
      body: (
        <P>
          Cookies are small files a website saves in your browser. Local storage keeps data in your browser in a similar way. EU
          law treats them alike: storage that is strictly necessary for a service you asked for needs no consent, while anything
          else, such as analytics or advertising, does.
        </P>
      )
    },
    {
      id: "ours",
      title: "What Influate stores",
      body: (
        <>
          <Table
            head={["Name", "Type", "Purpose", "Duration", "Category"]}
            rows={[
              [
                <code key="n">{SESSION_STORAGE_KEY}</code>,
                "Local storage",
                "Keeps you signed in between visits (your sign-in session)",
                "Until you sign out",
                "Strictly necessary"
              ],
              [
                <code key="n">{`${SESSION_STORAGE_KEY}-code-verifier`}</code>,
                "Local storage",
                "A one-time security code while you sign in with Google",
                "Removed once sign-in finishes",
                "Strictly necessary"
              ]
            ]}
          />
          <P>
            Data the app loads while you use it, such as profiles and partnerships, is kept in memory only and is gone when you
            close the tab.
          </P>
        </>
      )
    },
    {
      id: "third-party",
      title: "Third parties",
      body: (
        <>
          <P>
            If you choose &quot;Continue with Google&quot;, you are sent to Google and back through our sign-in server at
            supabase.co. Google may set its own cookies on its domains; that is covered by Google&apos;s privacy policy, not ours.
          </P>
          <P>If we ever add analytics or anything else that is not strictly necessary, we will ask for your consent first and update this page.</P>
        </>
      )
    },
    {
      id: "control",
      title: "Managing storage",
      body: (
        <P>
          You can view and delete site data in your browser settings. Clearing Influate&apos;s site data signs you out; nothing
          else breaks. Blocking storage for our site entirely stops sign-in from working.
        </P>
      )
    },
    {
      id: "changes",
      title: "Changes",
      body: (
        <P>
          We update this page whenever what we store changes. Questions? Email <LegalValue name="privacyEmail" />.
        </P>
      )
    }
  ]
}
