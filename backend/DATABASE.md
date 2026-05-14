# Database setup (PlayFit LMS)

The API uses **PostgreSQL** via the `pg` package. Connection settings are read from environment variables (see `.env.example` in this folder).

**Using Supabase as the host?** Follow **`SUPABASE.md`** for creating the project, connection strings, running migrations in the SQL editor, and Storage.

---

## Connection string (recommended)

Set a single **`DATABASE_URL`** (works for Supabase, Neon, Railway, local Postgres with `postgresql://...`). The pool enables SSL by default unless `DB_SSL=false`. See `src/config/database.js`.

## 1. Install PostgreSQL

Install PostgreSQL 14+ locally, or create a database on a host such as Neon, Supabase, or RDS.

## 2. Create the database

```bash
createdb playfit_lms
# or using psql:
# psql -U postgres -c "CREATE DATABASE playfit_lms;"
```

## 3. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and set:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — point at your PostgreSQL instance.
- `JWT_SECRET` — long random string used to sign login tokens.
- `JWT_EXPIRES_IN` — optional token lifetime (default `7d` in code if unset).

Each **Next.js** app (`frontend/student`, `frontend/instructor`, `frontend/admin`) should set its API base URL (see `services/apiConfig.ts` in that app) to your running API (e.g. `http://localhost:4000/api`).

## 4. Run SQL migrations (schema)

From the `backend` directory, apply the files under `src/models` **in numeric order** using `psql` (or any SQL client). Example:

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/playfit_lms"
for f in src/models/*.sql; do psql "$DATABASE_URL" -f "$f"; done
```

The repository’s files are ordered as:

1. `01_categories.sql`  
2. `02_users.sql` — **required** for auth (`student`, `instructor`, `admin`).  
3. `03_courses.sql` through `13_system_settings.sql` — feature tables (run in order).  
4. `14_password_reset_tokens.sql` — **required** for forgot-password (depends on `users`).  
5. `15_users_role_check.sql` — optional `CHECK` constraint on `role` (run after `02_users.sql`).

**Minimum for login/register/reset only:** run `02_users.sql`, then `14_password_reset_tokens.sql` (and optionally `15_users_role_check.sql`).

## 5. Verify the API

Start the server from `backend`:

```bash
npm install
npm run dev
```

Test registration and login against `POST /api/auth/register` and `POST /api/auth/login` (see `src/routes/index.js` for the global `/api` prefix).

## Portal-specific login

Each frontend sends `expectedRole` with login and forgot-password:

- Student app → `student`
- Instructor app → `instructor`
- Admin app → `admin`

That prevents, for example, signing in as an instructor on the student login screen.

## Password reset in development

`POST /api/auth/forgot-password` accepts `email`, `expectedRole`, and `clientOrigin` (your Next.js origin, e.g. `http://localhost:3000`). The API logs a full reset URL to the **server console**. Open that URL in the matching frontend app and submit a new password on `/reset-password`.

For production, replace logging with an email provider (SendGrid, SES, etc.) using the same token in the message.
