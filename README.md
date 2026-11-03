# Influate

A marketplace that connects growing creators with brands in their niche, and tracks what every affiliate code earns.

## Features

- **Bulgarian and English**: Bulgarian at `/`, English under `/en`.
- **Sign-up with a role**: creator or brand, by email/password or Google.
- **Profiles**: public details (categories, platforms, audience, headline, bio), visible without logging in, plus private
  contact details.
- **Discover**: browse the other side by category, platform, audience age and keyword.
- **Connect requests**: contact details unlock only when both sides accept.
- **Partnerships**: a connected creator and brand set up a campaign with an affiliate code.
- **Results**: either side logs sales, revenue and creator earnings per code; both dashboards show the totals.
- **Account**: download all your data as JSON, or delete your account.
- **Legal pages**: privacy policy (`/privacy`) and cookie policy (`/cookies`) in both languages.

Results are entered manually for now. Automatic tracking (e.g. a Shopify integration) is the next step.

## Stack

Node 26 · Next.js 16 (App Router) · React 19 · TypeScript (strict) · TanStack Query · next-intl · Tailwind CSS 4 ·
Supabase (Postgres + Auth, EU region) · hosted on Vercel.

## Project structure

```
messages/                 UI translations (bg.json, en.json); keys are type-checked
src/
  app/[locale]/           routes; every page exists in both languages
    account/              data export and account deletion
    dashboard/ discover/ partnerships/[id]/ profile/edit/ u/[uid]/ signup/ login/
    privacy/ cookies/     legal pages
  components/             UI building blocks (ui.tsx) and feature components
  content/legal/          privacy and cookie policy texts, per language
  i18n/                   locales, locale-aware Link/redirect, message loading
  lib/
    types.ts              domain types
    data.ts               plain async Supabase reads and writes (rows mapped to domain types)
    queries.ts            TanStack Query hooks: reads are queries, writes are mutations that invalidate what they change
    auth.ts               Supabase auth state via useSyncExternalStore
    database.types.ts     generated from the database (npm run db:types)
    legal.ts              company details used by the legal pages
  proxy.ts                language routing (Next.js 16 proxy)
supabase/migrations/      schema, row-level security, account functions
scripts/test-db.mjs       checks the access rules against the local database
docs/records-of-processing.md   internal GDPR record
```

Components never fetch in `useEffect`: all data goes through the hooks in `src/lib/queries.ts`, and every component
renders purely from props, state and query data.

### Data model and access rules

| Table | Contents | Who can read | Who can write |
|---|---|---|---|
| `profiles` | Public profile and role | Anyone | The owner (role can't change) |
| `contacts` | Email, phone, links | The owner and accepted connections | The owner |
| `connections` | Request between a creator and a brand | The two users | Sender creates, recipient answers, either removes |
| `partnerships` | Creator, brand, code, terms, status | The two participants | Connected pairs create; participants change the status |
| `results` | Logged sales for a partnership | The two participants | Participants add; authors delete |

`delete_my_account()` removes the login, profile, contacts and connections; shared partnerships and results stay with the
other side, anonymised. `export_my_data()` returns everything stored about the caller.

## Running locally

Needs Node 26 (`nvm use`) and Docker (for the local Supabase stack).

```bash
nvm use
npm install
npm run db:start      # local Postgres + Auth; prints the API URL and publishable key
```

Create `.env.local` with the local values from `npx supabase status`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from supabase status>
```

```bash
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build, including the TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:start` / `db:stop` | Start or stop the local Supabase stack |
| `npm run db:reset` | Recreate the local database from `supabase/migrations` |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` after a schema change |
| `npm run test:db` | Check the access rules against the local database |

## Production setup

Supabase project: `eqyfewqbbxblacvktbdf` (must be in an EU region).

1. Apply the schema to the hosted project:
   ```bash
   npx supabase login
   npx supabase link --project-ref eqyfewqbbxblacvktbdf
   npx supabase db push
   ```
2. In Supabase → Authentication → URL Configuration, set the Site URL to your production domain and add
   `https://<your-domain>/**` (and `https://*.vercel.app/**` for previews) to the redirect URLs.
3. For Google sign-in: enable Google under Authentication → Sign In / Providers with a Google OAuth client, and add
   `https://eqyfewqbbxblacvktbdf.supabase.co/auth/v1/callback` as an authorised redirect URI in Google Cloud.
4. In Vercel → Settings → Environment Variables, set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase → Project settings → API keys) for Production and Preview, then
   redeploy. The old `NEXT_PUBLIC_FIREBASE_*` variables can be removed.

Vercel detects Next.js automatically and uses Node 26 from `engines` in `package.json`.

## Before launch: legal checklist

- Fill in every `[BRACKETED]` value in [`src/lib/legal.ts`](src/lib/legal.ts); the legal pages highlight anything missing.
- Work through the open items in [`docs/records-of-processing.md`](docs/records-of-processing.md) (DPAs, region,
  backups).
- Have the privacy and cookie policies reviewed by a lawyer, in both languages.
- Before adding analytics or any other non-essential storage, update the cookie policy and add a consent banner.
