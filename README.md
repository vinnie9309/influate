# Influate

A marketplace that connects growing creators with brands in their niche, and tracks what every affiliate code earns.

## Features

- **Sign-up with a role**: creator or brand, by email/password or Google.
- **Profiles**: public details (categories, platforms, audience, headline, bio) plus private contact details.
- **Discover**: browse the other side by category, platform, audience age and keyword.
- **Connect requests**: contact details unlock only when both sides accept.
- **Partnerships**: a connected creator and brand set up a campaign with an affiliate code.
- **Results**: either side logs sales, revenue and creator earnings per code; both dashboards show the totals.
- **Legal pages**: privacy policy (`/privacy`) and cookie policy (`/cookies`), linked from every page's footer.

Results are entered manually for now. Automatic tracking (e.g. a Shopify integration) is the next step.

## Stack

Node 26 · Next.js 16 (App Router) · React 19 · TypeScript (strict) · TanStack Query · Tailwind CSS 4 · Firebase
Authentication and Cloud Firestore · hosted on Vercel.

## Project structure

```
src/
  app/                    routes (App Router)
    page.tsx              landing page with the animated hero
    signup/ login/        authentication
    profile/edit/         create and edit your profile
    discover/             search the other side
    u/[uid]/              public profile, connect, start a partnership
    dashboard/            stats, requests, partnerships, connections
    partnerships/[id]/    a partnership and its logged results
    privacy/ cookies/     legal pages
    providers.tsx         TanStack Query client
  components/             UI building blocks (ui.tsx) and feature components
  lib/
    types.ts              domain types
    data.ts               plain async Firestore reads and writes
    queries.ts            TanStack Query hooks: reads are queries, writes are mutations that invalidate what they change
    auth.ts               Firebase auth state via useSyncExternalStore
    legal.ts              company details used by the legal pages
    firebase.ts           Firebase setup (switches to emulators when configured)
firestore.rules           who can read and write what
```

Components never fetch in `useEffect`: all data goes through the hooks in `src/lib/queries.ts`.

### Data model

| Collection | Contents | Who can read |
|---|---|---|
| `profiles/{uid}` | Public profile and role | Anyone |
| `contacts/{uid}` | Email, phone, links | The owner and accepted connections |
| `connections/{uidA_uidB}` | Request between a creator and a brand | The two users |
| `partnerships/{id}` | Creator, brand, code, terms, status | The two participants |
| `results/{id}` | Logged sales for a partnership | The two participants |

## Running locally

Uses Node 26 (see `.nvmrc`).

```bash
nvm use
npm install
```

### Against local emulators (no Firebase project needed)

Requires Java 11+ (`brew install openjdk@21`).

```bash
echo "NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true" > .env.local
npm run emulators   # auth on :9099, firestore on :8080
npm run dev         # in a second terminal
```

### Against a real Firebase project

Copy `.env.example` to `.env.local` and fill in your web app config. Enable Email/Password and Google sign-in in
Authentication, then deploy the rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build, including the TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run emulators` | Firebase Auth and Firestore emulators |

## Deploying to Vercel

Vercel detects Next.js automatically and uses Node 26 from `engines` in `package.json`.

1. Import the GitHub repository in Vercel (Add New → Project). Keep the default build settings.
2. Under Settings → Environment Variables, add the six `NEXT_PUBLIC_FIREBASE_*` values from `.env.example` for
   Production and Preview. Do not set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`.
3. In the Firebase console, open Authentication → Settings → Authorized domains and add your Vercel domain
   (e.g. `your-project.vercel.app`), otherwise Google sign-in is rejected.
4. Deploy the Firestore rules and indexes (`firebase deploy --only firestore:rules,firestore:indexes`) if you haven't.

## Before launch: legal checklist

The privacy and cookie policies describe what the app does today. Before going live:

- Fill in every `[BRACKETED]` value in [`src/lib/legal.ts`](src/lib/legal.ts) (company name, registration number,
  address, privacy email, Firestore location). The pages highlight anything still missing.
- Have the texts reviewed by a lawyer; they are a starting point, not legal advice.
- Update the cookie policy before adding analytics or any other non-essential storage, and add a consent banner at
  the same time.
