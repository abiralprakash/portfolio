# Payload CMS — Prakash Adhikari portfolio

Authoring layer for the Personal Product Lab and the rest of the public site.

The public site still deploys as **static assets on Cloudflare Workers**. Payload is the CMS: editors change content here, then an export writes a JSON snapshot that the frontend bundles at build time.

```
cms/  (this app)
  collections  systems, capabilities, process stages, proof, case studies, media, users
  globals      identity, now/bench, site settings (nav + SEO)
  scripts      seed.ts, export-content.ts
demo/src/content/content.json   ← published snapshot consumed by the lab
```

## First run

```bash
cd cms
cp .env.example .env          # then set PAYLOAD_SECRET and SEED_ADMIN_PASSWORD
npm install
npm run seed                  # loads verified content from scripts/seed-data.ts
npm run export                # writes demo/src/content/content.json
npm run dev                   # http://localhost:3000/admin
```

Default admin is `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`.

## Daily workflow

1. Edit in `/admin`.
2. `npm run export` (or `npm run cms:export` from the repo root).
3. `npm run demo:build` / `npm run deploy` from the repo root.

Drafts stay in Payload. Only published documents are exported.

## Access

| Role   | Can |
|--------|-----|
| Admin  | Manage users, delete content, change roles |
| Editor | Create and update content, cannot delete or manage users |
| Public | Read published documents only |

## Media

Uploads live on local disk (`cms/media/`) during authoring. Image derivatives are WebP at 480 / 960 / 1440. When `R2_*` env vars are all set, the same collection stores files on Cloudflare R2 instead.

Records also keep a `staticPath` for assets already served by the site (`/demo-assets/...`). The export prefers that path so the Worker keeps serving files it already has.

## Hosting the CMS later

This app is Next.js 16 + Payload 3 + SQLite. For a hosted admin:

- Point `DATABASE_URI` at Turso/libSQL or switch the adapter to Postgres
- Fill `R2_*` for media
- Deploy to a Node host (or Cloudflare Containers). The public site does not need to change.
