# PawTag - Supabase Secret Token Access

This refactor changes the project from localStorage/session-style access to:

- Public profile: `/p/:tag_id`
- First claim: `/claim/:tag_id`
- Token edit: `/edit/:secret_token`
- Request access: `/request-access`

## 1. Database

Run:

`supabase/migrations/001_secret_token_access.sql`

in Supabase SQL Editor.

The migration adds:

- `tag_id`
- `secret_token`
- `is_claimed`
- `owner_email`

It also adds unique indexes and enables RLS.

## 2. Edge Functions

Deploy:

- `public-pet`
- `claim-tag`
- `edit-by-token`
- `request-access`

The functions use the service role key server-side. Never expose that key in frontend files.

## 3. Supabase secrets

Configure:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SITE_URL`

Example:

`PUBLIC_SITE_URL=https://your-domain.example`

## 4. Email provider

The claim and request-access functions contain explicit TODOs for transactional email.

Recommended production behavior:

- claim-tag: send confirmation + edit link
- request-access: send one or more edit links
- never return secret tokens to public profile endpoints
- never reveal whether an email exists

## 5. Frontend config

Edit:

`assets/js/supabase-config.js`

Set only:

- `SUPABASE_URL`
- `FUNCTIONS_URL`

Do NOT put service-role or email provider secrets in this file.

## 6. Routing

The included pages expect hosting rewrites:

- `/p/:tag_id` -> your public profile HTML
- `/claim/:tag_id` -> `pages/claim.html`
- `/edit/:secret_token` -> your edit HTML
- `/request-access` -> `pages/request-access.html`

For a static host, configure rewrites in that host's configuration.

## 7. Existing UI

This package intentionally does not destroy the existing visual markup. New Supabase adapters are separate files:

- `assets/js/publicpet-supabase.js`
- `assets/js/editpet-supabase.js`
- `assets/js/claim.js`
- `assets/js/request-access.js`

Attach these to the existing pages after setting up the route rewrites.

## 8. Security notes

The secret token is effectively a bearer credential. Anyone who possesses the edit URL can edit the corresponding pet.

Recommended production hardening:

- use a long, unguessable token if moving away from UUIDs later
- rate-limit claim and request-access endpoints
- add CAPTCHA/abuse controls
- keep the token out of public API responses
- never log complete edit URLs/tokens
- consider rotating/revoking tokens in a future owner recovery flow
