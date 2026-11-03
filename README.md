# Influate

A marketplace that connects growing creators with brands in their niche, and tracks what every affiliate code earns.

## What's in the MVP

- **Sign-up with a role**: creator or brand (email/password or Google).
- **Profiles**: public details (categories, platforms, audience, headline, bio) plus private contact details.
- **Discover**: browse the other side by category, platform, audience age and keyword.
- **Connect requests**: contact details unlock only when both sides accept.
- **Partnerships**: a connected creator and brand set up a campaign with an affiliate code.
- **Results**: either side logs sales, revenue and creator earnings per code; both dashboards show the totals.

Results are entered manually for now. Automatic tracking (e.g. a Shopify integration) is the next step.

## Stack

Node 26, Next.js 16 (App Router), React 19, Tailwind CSS 4, Firebase Auth and Firestore. Access control lives in [`firestore.rules`](firestore.rules).

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

## Deploying to Vercel

Vercel detects Next.js automatically and uses Node 26 from `engines` in `package.json`.

1. Import the GitHub repository in Vercel (Add New → Project). Keep the default build settings.
2. Under Settings → Environment Variables, add the six `NEXT_PUBLIC_FIREBASE_*` values from `.env.example` for
   Production and Preview. Do not set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`.
3. In the Firebase console, open Authentication → Settings → Authorized domains and add your Vercel domain
   (e.g. `your-project.vercel.app`), otherwise Google sign-in is rejected.
4. Deploy the Firestore rules and indexes (`firebase deploy --only firestore:rules,firestore:indexes`) if you haven't.
