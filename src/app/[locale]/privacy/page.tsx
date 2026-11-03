import type { Metadata } from "next"
import { use } from "react"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { LEGAL } from "@/lib/legal"
import LegalPage, { LegalValue, List, P, Section, Table } from "@/components/LegalPage"

export const metadata: Metadata = {
  title: "Privacy policy — Influate",
  description: "What personal data Influate collects, why, who can see it, where it is stored and how to exercise your rights."
}

const contents = [
  { id: "who", title: "Who we are" },
  { id: "data", title: "Data we collect" },
  { id: "visibility", title: "Who can see your data" },
  { id: "purposes", title: "Why we use it" },
  { id: "processors", title: "Service providers" },
  { id: "location", title: "Where it is stored" },
  { id: "retention", title: "How long we keep it" },
  { id: "rights", title: "Your rights" },
  { id: "age", title: "Age requirement" },
  { id: "security", title: "Security" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" }
] as const

const email = <LegalValue name="privacyEmail" />

export default function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  setRequestLocale(use(params).locale)
  return (
    <LegalPage
      title="Privacy policy"
      contents={contents}
      intro={
        <P>
          Influate connects content creators with brands and helps both sides track the partnerships they agree. This
          policy explains what personal data we handle to do that, who can see it, and the choices you have. It applies
          to the Influate website and app.
        </P>
      }
    >
      <Section id="who" title="Who we are">
        <P>
          The controller of your personal data is <LegalValue name="company" /> (registration number{" "}
          <LegalValue name="registrationNumber" />
          ), <LegalValue name="address" />. You can reach us about anything in this policy at {email}.
        </P>
      </Section>

      <Section id="data" title="Data we collect">
        <P>We only collect what you give us while using Influate, plus the technical data needed to run the service.</P>
        <Table
          head={["Category", "What it includes", "Source"]}
          rows={[
            [
              "Account",
              "Email address, password (stored by Firebase Authentication as a one-way hash; we never see it), name or company name, and whether you are a creator or a brand. If you sign in with Google: your Google name, email and account identifier.",
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
              "Sign-in timestamps, and IP address, browser and device information in server and security logs kept by our hosting and authentication providers.",
              "Collected automatically"
            ]
          ]}
        />
        <P>We do not use advertising trackers, sell personal data, or make automated decisions that have legal effects on you.</P>
      </Section>

      <Section id="visibility" title="Who can see your data">
        <List
          items={[
            <>
              <strong>Anyone, including people without an account:</strong> your public profile.
            </>,
            <>
              <strong>Users you are connected with:</strong> your contact details, but only after a connect request between you
              has been accepted.
            </>,
            <>
              <strong>Your partner in a partnership:</strong> the partnership and every result logged for it.
            </>,
            <>
              <strong>Nobody else:</strong> your email address used for signing in, your connection requests and notes, and
              your partnerships stay private to you and the other party.
            </>
          ]}
        />
      </Section>

      <Section id="purposes" title="Why we use it">
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
      </Section>

      <Section id="processors" title="Service providers">
        <P>
          These companies process data on our behalf under data processing agreements. They may only use it to provide
          their service to us.
        </P>
        <Table
          head={["Provider", "What they do", "Data"]}
          rows={[
            [
              "Google Ireland Ltd / Google LLC (Firebase Authentication)",
              "Sign-in and account security",
              "Account data, sign-in and security logs"
            ],
            ["Google Ireland Ltd / Google LLC (Cloud Firestore)", "Database", "Everything you save in Influate"],
            ["Vercel Inc.", "Website hosting", "Request logs (IP address, browser, pages requested)"]
          ]}
        />
        <P>
          Some of these providers process data in the United States. Those transfers rely on the EU–US Data Privacy
          Framework and, where it does not apply, the European Commission&apos;s Standard Contractual Clauses.
        </P>
      </Section>

      <Section id="location" title="Where it is stored">
        <P>
          Profiles, contact details, connections, partnerships and results are stored in Google Cloud Firestore in{" "}
          <LegalValue name="firestoreLocation" />. Account sign-in data held by Firebase Authentication may be processed
          in the United States as described above.
        </P>
      </Section>

      <Section id="retention" title="How long we keep it">
        <List
          items={[
            "Account, profile and contact details: for as long as your account exists.",
            "Connections, partnerships and results: for as long as either party's account exists, because both of you rely on that history.",
            `After you delete your account we erase your data from our live systems within ${LEGAL.deletionDays} days. Partnership records you share with another user are anonymised on your side rather than removed from theirs.`,
            "Server and security logs: kept by our providers for their standard retention periods, typically up to 30 days."
          ]}
        />
      </Section>

      <Section id="rights" title="Your rights">
        <P>Under the GDPR you have the right to:</P>
        <List
          items={[
            "access the personal data we hold about you and get a copy of it;",
            "correct inaccurate data, most of which you can edit yourself on your profile;",
            "have your data erased;",
            "receive your data in a portable, machine-readable format;",
            "restrict or object to processing based on our legitimate interests."
          ]}
        />
        <P>
          To use any of these rights, email {email} from the address on your account. We reply within one month. You can
          also complain to a data protection authority. Ours is the <LegalValue name="supervisoryAuthority" />, but you may
          contact the authority where you live.
        </P>
      </Section>

      <Section id="age" title="Age requirement">
        <P>
          You must be at least {LEGAL.minimumAge} years old to create an account. We do not knowingly collect data from
          anyone younger. If you believe a child has signed up, contact us and we will delete the account.
        </P>
      </Section>

      <Section id="security" title="Security">
        <P>
          Data is encrypted in transit (HTTPS) and at rest by our providers. Database security rules make sure each piece
          of data is only readable by the people described above, and passwords are never stored in plain text.
        </P>
      </Section>

      <Section id="changes" title="Changes">
        <P>
          If we change this policy we will update the date at the top, and tell you in the app or by email before
          significant changes take effect.
        </P>
      </Section>

      <Section id="contact" title="Contact">
        <P>
          Questions about privacy go to {email}. How we use browser storage is explained in our{" "}
          <Link href="/cookies" className="font-semibold">
            cookie policy
          </Link>
          .
        </P>
      </Section>
    </LegalPage>
  )
}
