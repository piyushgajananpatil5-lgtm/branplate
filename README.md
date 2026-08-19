# BranPlate — MERN

BranPlate is now a real MERN application:

- MongoDB Atlas: persistent products, users, admins, orders, inquiries, impact metrics and config
- Express + Node.js: REST API, validation, server-side order totals and RBAC
- React + Vite: existing storefront UI
- JWT + bcrypt: real login/register instead of the old client-only email login
- Gemini remains optional for the AI tableware advisor

## Important: keep the same MongoDB Atlas cluster

The code still uses the same `MONGO_URI` environment variable. The Atlas connection string is **server-only** and is no longer hard-coded into React or returned by `/api/config`.

Create `.env` from `.env.example` and set:

- `MONGO_URI` — your existing Atlas connection string
- `JWT_SECRET` — long random secret
- `ADMIN_BOOTSTRAP_PASSWORD` — password used to seed the existing administrator emails on first database initialization
- `CUSTOMER_BOOTSTRAP_PASSWORD` — password for the two seeded customer accounts
- `GEMINI_API_KEY` — optional

Do not commit `.env`.

## Login fix

The old app had several login problems:

1. The login button never called `/api/users/login`; it only changed React state.
2. Any email could be treated as logged in.
3. Admin access was exposed through a one-click email selector.
4. Users/admins were stored only in arrays, so login/data disappeared on restart.
5. MongoDB was connected but most API operations still used memory.
6. Admin endpoints had no real authorization.
7. The client could submit arbitrary order totals.

The new flow is:

`React -> /api/auth/login -> bcrypt verification -> JWT -> authenticated API requests -> MongoDB`

The admin portal now requires a valid admin JWT and permission checks.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Render

Keep the existing `branplate-service`. Add the environment variables from `.env.example` in Render. Keep your existing `MONGO_URI` value so the same Atlas cluster/database is used.

The application is intentionally configured to fail startup if `MONGO_URI`, `JWT_SECRET`, or `ADMIN_BOOTSTRAP_PASSWORD` is missing. This prevents the previous silent in-memory fallback that made data and login appear to work but disappear after restart.

## Database bootstrap

On first startup, the server upserts the existing BranPlate seed catalog, administrators, customers, orders, inquiry and impact data. Existing MongoDB documents are not overwritten by the seed values.
