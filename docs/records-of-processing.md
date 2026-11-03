# Record of processing activities (GDPR Art. 30)

Internal record for Influate. Not published. Review whenever a feature, provider or data field changes, and at least
once a year.

| | |
|---|---|
| **Controller** | [COMPANY LEGAL NAME], ЕИК [NUMBER], [REGISTERED ADDRESS] |
| **Contact for data protection** | [PRIVACY CONTACT EMAIL] |
| **DPO** | Not appointed: no large-scale processing of special-category data or systematic monitoring (Art. 37) |
| **Supervisory authority** | Комисия за защита на личните данни (КЗЛД), cpdp.bg |
| **Last reviewed** | 2026-11-03 |

## Processing activities

| Activity | Purpose | Legal basis | Data subjects | Personal data | Recipients | Retention |
|---|---|---|---|---|---|---|
| User accounts | Sign-in and account management | Contract, Art. 6(1)(b) | Creators and brand representatives | Email, password hash, name/company name, role, Google account ID (if used), sign-in times | Supabase (processor) | Until the account is deleted |
| Public profiles | Being found in search | Contract, Art. 6(1)(b) | Same | Headline, bio, city, categories, platforms, audience age, follower range, audience description, website | Public (anyone), Supabase | Until the account is deleted |
| Contact details | Sharing contacts after a mutual connection | Contract, Art. 6(1)(b) | Same | Contact email, phone, social links | Accepted connections, Supabase | Until the account is deleted |
| Connections | Requests between creators and brands | Contract, Art. 6(1)(b) | Same | Who asked whom, note, status, timestamps | The two users, Supabase | Until withdrawn or either account is deleted |
| Partnerships and results | Tracking affiliate codes and sales | Contract, Art. 6(1)(b) | Same | Campaign, code, terms, sales, revenue, creator earnings, notes | The two partners, Supabase | While either side's account exists; the deleted side is anonymised |
| Security and request logs | Keeping the service secure, preventing abuse | Legitimate interests, Art. 6(1)(f) | Visitors and users | IP address, browser, timestamps, requested pages | Supabase, Vercel | Provider default, up to 30 days |
| Privacy requests | Answering access/erasure/other requests | Legal obligation, Art. 6(1)(c) | Users who write to us | Email correspondence | — | 3 years after the request is closed |

No special-category data (Art. 9), no profiling with legal effects, no advertising or analytics trackers, no cookies.

## Processors and transfers

| Processor | Service | Data location | Transfer safeguard | DPA |
|---|---|---|---|---|
| Supabase, Inc. | Postgres database, authentication | EU: [SUPABASE REGION] | EU–US Data Privacy Framework / SCCs for support access | Accept in Supabase dashboard → Organization → Legal documents |
| Vercel Inc. | Website hosting, request logs | Global edge network | EU–US Data Privacy Framework / SCCs | Included in Vercel's terms; signed copy downloadable from vercel.com/legal |
| Google (only if a user chooses Google sign-in) | Identity provider | — | Google is an independent controller for the sign-in | — |

## Technical and organisational measures (Art. 32)

- Row-level security on every table (`supabase/migrations`); rules covered by `npm run test:db`.
- Contacts readable only by the owner and accepted connections; roles and affiliate codes immutable.
- Passwords stored as bcrypt hashes by Supabase Auth; TLS in transit; encryption at rest by the provider.
- Access to the Supabase and Vercel dashboards limited to [WHO], with two-factor authentication.
- Self-service data export and account deletion on `/account` (`export_my_data`, `delete_my_account`).

## Data subject requests

1. Access/portability and erasure are self-service on `/account`. Corrections are self-service on the profile page.
2. Anything else arrives at [PRIVACY CONTACT EMAIL]. Verify the sender matches the account email, act within one
   month (extendable by two for complex cases), and log the request and outcome below.

| Date | Request | Outcome | Closed |
|---|---|---|---|
| | | | |

## Personal data breaches (Art. 33–34)

1. Contain: revoke keys or sessions, fix the hole, preserve logs.
2. Assess within 24 hours: what data, how many people, likely consequences.
3. Unless the breach is unlikely to result in a risk to people, notify КЗЛД within **72 hours** of becoming aware
   (cpdp.bg). If the risk is high, also tell the affected users without undue delay.
4. Record every breach here, including ones that weren't notified, with the reasoning.

| Date found | What happened | Data / people affected | Notified КЗЛД? | Users told? | Actions |
|---|---|---|---|---|---|
| | | | | | |

## Open items

- [ ] Fill in the company details here and in `src/lib/legal.ts`.
- [ ] Confirm the Supabase project region is in the EU and record it in both places.
- [ ] Accept the Supabase DPA and download Vercel's.
- [ ] Record the backup retention for the Supabase plan in `src/lib/legal.ts` (`backupDays`).
- [ ] Have a lawyer review the privacy and cookie policies (both languages).
