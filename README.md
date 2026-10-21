# JSB Sons

Storefront and commerce backend for **JSB Sons**, Sadar Bazar, Gurugram.

- Backend: Medusa 2.21 (Node 22, PostgreSQL 15+)
- Storefront: Next.js 14 App Router, custom editorial design
- Monorepo: Turborepo with npm workspaces
- Extras: mobile-based customer accounts, custom Studio admin, order notifications, Google Sheets order mirror, embedded local PostgreSQL for development

## Structure

```text
apps/
  backend/       Medusa application, custom modules, API routes, seed script
  storefront/    Next.js storefront + custom admin ("Studio")
  local-db/      Embedded PostgreSQL used for local development only
```

## Local development

Prerequisites: Node 22.22+, npm 10, Git.

```powershell
npm install

# 1. Start the embedded local PostgreSQL (keep this terminal running)
npm run start --workspace=@jsb/local-db

# 2. Create env files from the templates
Copy-Item apps/backend/.env.template apps/backend/.env
Copy-Item apps/storefront/.env.template apps/storefront/.env.local
#    Fill DATABASE_URL=postgres://postgres:postgres@localhost:5432/jsb_sons

# 3. Prepare the database
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@jsbsons.local -p "<your-admin-password>"
npm run seed

# 4. Run the apps (separate terminals, from the repo root)
npm run backend:dev
npm run dev --workspace=@dtc/storefront
```

- Storefront: http://localhost:3000
- Medusa API: http://localhost:9000
- Built-in Medusa admin: http://localhost:9000/app
- Custom Studio: http://localhost:3000/admin

The seed prints the publishable API key. Put it in `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

## Environment files

Committed: only the `*.env.template` files.
Ignored by Git: `.env`, `.env.local`, `.pgdata/`, `.next/`, `.medusa/`, logs.

| File | Purpose |
| --- | --- |
| `apps/backend/.env` | Database, Redis, CORS, JWT/cookie secrets, Google Sheets |
| `apps/storefront/.env.local` | Backend URL, publishable key, public site URL, Studio login gate |
| `render.yaml` | Render blueprint for the backend |

Never commit real secrets. See [DEPLOYMENT.md](DEPLOYMENT.md) for the production checklist.

## Commands

| Command | What it does |
| --- | --- |
| `npm run backend:dev` | Medusa backend with file watcher |
| `npm run dev --workspace=@dtc/storefront` | Storefront dev server on port 3000 |
| `npm run build --workspace=@dtc/backend` | Production backend build |
| `npm run build --workspace=@dtc/storefront` | Production storefront build |
| `npm run lint --workspace=@dtc/backend` | Medusa lint |
| `npm run lint --workspace=@dtc/storefront` | Next.js lint |
| `npm run seed --workspace=@dtc/backend` | Reseed catalog, region, shipping |
| `npm run sync:sheets --workspace=@dtc/backend` | Push all orders to Google Sheets |
| `npm test` | Backend tests |

## Deployment

Backend on Render (Singapore) + Postgres on Supabase (Mumbai) + storefront on Vercel.
Step-by-step: [DEPLOYMENT.md](DEPLOYMENT.md).

Current limitations: checkout is pay-on-delivery (no payment gateway), no email/SMS
provider, and product create/edit is delegated to the built-in Medusa admin.
