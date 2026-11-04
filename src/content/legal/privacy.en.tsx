import { Link } from "@/i18n/navigation"
import { LEGAL } from "@/lib/legal"
import { LegalValue, List, P, Table } from "@/components/LegalPage"
import type { LegalDocument } from "./types"

const email = <LegalValue name="privacyEmail" />

export const privacyEn: LegalDocument = {
  title: "Privacy policy",
  description: "What personal data Influate collects, why, who can see it, where it is stored and how to exercise your rights.",
  intro: (
    <P>
      Influate connects content creators with brands and helps both sides track the partnerships they agree. This policy
      explains what personal data we handle to do that, who can see it, and the choices you have. It applies to the
      Influate website and app.
    </P>
  ),
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: (
        <P>
          The controller of your personal data is <LegalValue name="company" /> (registration number{" "}
          <LegalValue name="registrationNumber" />
          ), <LegalValue name="address" />. You can reach us about anything in this policy at {email}.
        </P>
      )
    },
    {
      id: "data",
      title: "Data we collect",
      body: (
        <>
          <P>We only collect what you give us while using Influate, plus the technical data needed to run the service.</P>
          <Table
            head={["Category", "What it includes", "Source"]}
            rows={[
              [
                "Account",
                "Email address, password (stored only as a one-way bcrypt hash; we never see it), name or company name, and whether you are a creator or a brand. If you sign in with Google: your Google name, email and account identifier.",
                "You, or Google if you choose Google sign-in"
              ],
              [
                "Public profile",
                "Headline, about text, city, categories, platforms, audience age, follower range, audience or ideal-customer description, website.",
                "You"
              ],
              ["Contact details", "Contact email, phone number and social links.", "You"],
              ["Connections", "Requests you send or receive, the note attached, and whether they were accepted or declined.", "You and the other user"],
              [
                "Partnerships and results",
                "Campaign name, affiliate code, terms, and logged sales, revenue and creator earnings, with optional notes.",
                "You and your partner"
              ],
              [
                "Technical",
                "Sign-in times, and IP address and browser details in the security and request logs kept by our database and hosting providers.",
                "Collected automatically"
              ]
            ]}
          />
          <P>We do not use advertising or analytics trackers, sell personal data, or make automated decisions that have legal effects on you.</P>
        </>
      )
    },
    {
      id: "visibility",
      title: "Who can see your data",
      body: (
        <List
          items={[
            <>
              <strong>Anyone, including people without an account:</strong> your public profile.
            </>,
            <>
              <strong>Users you are connected with:</strong> your contact details, but only after a connect request between you has
              been accepted.
            </>,
            <>
              <strong>Your partner in a partnership:</strong> the partnership and every result logged for it.
            </>,
            <>
              <strong>Nobody else:</strong> your sign-in email, your connection requests and notes, and your partnerships stay
              private to you and the other party.
            </>
          ]}
        />
      )
    },
    {
      id: "purposes",
      title: "Why we use it",
      body: (
        <Table
          head={["Purpose", "Legal basis (GDPR)"]}
          rows={[
            ["Creating your account and showing your profile in search", "Performance of a contract, Art. 6(1)(b)"],
            ["Connect requests, sharing contact details and tracking partnerships", "Performance of a contract, Art. 6(1)(b)"],
            ["Keeping the service secure and preventing abuse", "Legitimate interests, Art. 6(1)(f)"],
            ["Answering your questions and requests", "Performance of a contract, Art. 6(1)(b)"],
            ["Keeping records the law requires", "Legal obligation, Art. 6(1)(c)"]
          ]}
        />
      )
    },
    {
      id: "processors",
      title: "Service providers",
      body: (
        <>
          <P>
            These companies process data on our behalf under data processing agreements and may only use it to provide their
            service to us.
          </P>
          <Table
            head={["Provider", "What they do", "Data"]}
            rows={[
              ["Supabase, Inc.", "Database and sign-in", "Everything you save in Influate, account data, security logs"],
              ["Vercel Inc.", "Website hosting", "Request logs (IP address, browser, pages requested)"]
            ]}
          />
          <P>
            If you choose &quot;Continue with Google&quot;, Google shares your name and email with us to sign you in. Google
            handles that sign-in under its own privacy policy.
          </P>
          <P>
            Supabase and Vercel are US companies. Where their staff or systems access data from outside the EU, the transfer relies
            on the EU–US Data Privacy Framework or the European Commission&apos;s Standard Contractual Clauses.
          </P>
        </>
      )
    },
    {
      id: "location",
      title: "Where it is stored",
      body: (
        <P>
          Your account, profile, contact details, connections, partnerships and results are stored in one database in the
          European Union: our Supabase project in <LegalValue name="dataRegion" />. The website itself is delivered through
          Vercel&apos;s global network, which keeps only request logs.
        </P>
      )
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: (
        <List
          items={[
            "Account, profile and contact details: for as long as your account exists.",
            "Connections: until either of you withdraws or deletes your account.",
            "Partnerships and results: for as long as either party's account exists, because both of you rely on that history.",
            <>
              When you delete your account, your login, profile, contact details and connections are erased immediately.
              Partnerships and results you shared stay with the other party with your side anonymised, and are erased once both
              sides are gone. Deleted data can remain in encrypted database backups for up to <LegalValue name="backupDays" /> days
              until they are overwritten.
            </>,
            "Security and request logs: kept by our providers for their standard periods, typically no more than 30 days."
          ]}
        />
      )
    },
    {
      id: "rights",
      title: "Your rights",
      body: (
        <>
          <P>Under the GDPR you have the right to access, correct, erase and port your data, and to restrict or object to processing based on our legitimate interests. In practice:</P>
          <List
            items={[
              <>
                <strong>Correct:</strong> edit your profile and contact details at any time.
              </>,
              <>
                <strong>Access and portability:</strong> download everything we store about you as a JSON file on your{" "}
                <Link href="/account" className="font-semibold">
                  Account
                </Link>{" "}
                page.
              </>,
              <>
                <strong>Erase:</strong> delete your account on the same page.
              </>,
              <>
                <strong>Everything else:</strong> email {email} from the address on your account. We reply within one month.
              </>
            ]}
          />
          <P>
            You can also complain to a data protection authority. Ours is Bulgaria&apos;s Commission for Personal Data Protection
            (cpdp.bg), but you may contact the authority where you live.
          </P>
        </>
      )
    },
    {
      id: "age",
      title: "Age requirement",
      body: (
        <P>
          You must be at least {LEGAL.minimumAge} years old to create an account. We do not knowingly collect data from anyone
          younger. If you believe a child has signed up, contact us and we will delete the account.
        </P>
      )
    },
    {
      id: "security",
      title: "Security",
      body: (
        <P>
          Data is encrypted in transit (HTTPS) and at rest. Database rules make sure each piece of data is only readable by the
          people described above, and passwords are only ever stored as one-way hashes.
        </P>
      )
    },
    {
      id: "changes",
      title: "Changes",
      body: (
        <P>
          If we change this policy we will update the date at the top, and tell you in the app or by email before significant
          changes take effect.
        </P>
      )
    },
    {
      id: "contact",
      title: "Contact",
      body: (
        <P>
          Questions about privacy go to {email}. How we use browser storage is explained in our{" "}
          <Link href="/cookies" className="font-semibold">
            cookie policy
          </Link>
          .
        </P>
      )
    }
  ]
}
