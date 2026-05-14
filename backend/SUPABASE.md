# Using Supabase with PlayFit LMS

Supabase gives you **PostgreSQL**, **Storage** (S3-compatible), and optional Auth. This backend uses **your own Postgres schema** (SQL files in `src/models`) and **Express + JWT** for authentication. Supabase is the **database host** and optionally the **file storage** provider.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. **New project** → choose organization, name, database password (save it), region.
3. Wait until the project finishes provisioning.

---

## 2. Apply the database schema

You need the same tables this repo defines (users, courses, etc.).

### ⭐ Recommended: Automated Migration System

The easiest and most reliable way to apply all migrations:

1. Set `DATABASE_URL` in `backend/.env` to your Supabase connection string (port 5432)
2. Run the migration system:

```bash
cd backend
npm install
npm run migrate:full
```

This will:
- ✅ Create migration tracking table
- ✅ Apply all base schema files (01-17)
- ✅ Apply all migration files (profile fields, indexes, etc.)
- ✅ Skip already-applied migrations
- ✅ Track what's been applied

To check migration status anytime:
```bash
npm run migrate:check
```

See `MIGRATIONS.md` for detailed documentation.

### Option B — SQL Editor (manual, in Supabase dashboard)

1. In Supabase: **SQL** → **New query**.
2. Open each file from `backend/src/models` **in numeric order** (`00_…` through `17_…`).
3. Paste the file contents into the editor and click **Run**.
4. Repeat for every `.sql` file.
5. Also run files in `backend/src/models/migrations/` folder.

### Option C — `psql` with connection string

1. **Project Settings** → **Database**.
2. Under **Connection string**, choose **URI** (direct, port **5432**). Copy it and replace `[YOUR-PASSWORD]` with your database password.
3. From your machine:

```bash
cd backend
export DATABASE_URL="postgresql://postgres.[ref]:PASSWORD@db.[ref].supabase.co:5432/postgres"
for f in src/models/*.sql; do psql "$DATABASE_URL" -f "$f"; done
for f in src/models/migrations/*.sql; do psql "$DATABASE_URL" -f "$f"; done
```

If migration fails on SSL, ensure `DATABASE_URL` is correct and that `DB_SSL` is not set to `false` for Supabase cloud.

---

## 3. Connection strings: direct vs pooler

| Mode | Typical port | Use case |
|------|----------------|----------|
| **Session / Direct** | `5432` | Migrations, long-lived Node server (this API) |
| **Transaction pooler** | `6543` | Many short connections; URI often includes `?pgbouncer=true` |

For this Express API, **direct `5432`** is the least surprising. The pooler can work for high traffic; if you use it, use the URI Supabase labels for **Transaction** or **Session** pooler and follow their docs.

Put the chosen URI in **`DATABASE_URL`** inside `backend/.env`.

---

## 4. API keys (Settings → API)

- **`anon` `public`** — for browser Supabase clients (this backend does not require it unless you add client-side Supabase).
- **`service_role` `secret`** — **server only**. Used here for **Storage** uploads.

In `.env`:

```env
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Never expose `service_role` in Next.js client bundles.

---

## 5. Storage bucket (file uploads)

1. **Storage** → **New bucket**.
2. Name it (e.g. `playfit-uploads`) and match **`SUPABASE_BUCKET`** in `.env`.
3. For public PDFs/images, enable **Public bucket**; for private files, keep it private and use signed URLs (you can extend `storageService.js` later).

Policies (if bucket is **not** public): add RLS policies so the `service_role` key can upload (server-side client usually bypasses RLS — confirm in Supabase docs for your project version).

---

## 6. Wire the Node API

In `backend/.env`:

- `DATABASE_URL` — Postgres URI from Supabase.
- `JWT_SECRET` — long random string (your app signs JWTs; this is **not** Supabase JWT).
- `CORS_ORIGIN` — comma-separated origins of your three Next.js apps.
- Optional: `SUPABASE_*` if you use `POST /api/storage/upload`.

Start the API:

```bash
cd backend
npm run dev
```

Point each frontend `apiConfig` base URL to `http://localhost:5000/api` (or your deployed API URL).

---

## 7. Do you need Supabase Auth?

**No**, for the current codebase. Logins use `users` in **your** Postgres and **JWT** from this Express app.

You *can* migrate to Supabase Auth later; that would replace `authController` and `users.password` handling — it’s a separate refactor.

---

## 8. Checklist

- [ ] Project created, password saved  
- [ ] All migrations applied via `npm run migrate:full`
- [ ] Verify with `npm run migrate:check` - should show 21 applied migrations
- [ ] `DATABASE_URL` set (SSL on for Supabase cloud)  
- [ ] `JWT_SECRET` set  
- [ ] `npm run dev` starts; `GET /health` returns `ok`  
- [ ] (Optional) Storage bucket + `SUPABASE_*` for uploads  
- [ ] `CORS_ORIGIN` includes every frontend origin you use  

More details:
- Migration system: `MIGRATIONS.md`
- Generic Postgres notes: `DATABASE.md`

randhircool44@gmail.com