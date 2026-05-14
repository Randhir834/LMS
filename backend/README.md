# PlayFit LMS — API

Express.js REST API with PostgreSQL, JWT authentication, and optional Supabase Storage.

## Quick start

```bash
cp .env.example .env
# Edit .env: DATABASE_URL (or DB_*), JWT_SECRET, CORS_ORIGIN

npm install
npm run migrate   # applies src/models/*.sql in order — requires valid DATABASE_URL
npm run dev       # http://localhost:5000
```

- **Health:** `GET http://localhost:5000/health`
- **API prefix:** `/api` (e.g. `POST /api/auth/login`)

## Documentation

| File | Purpose |
|------|---------|
| `DATABASE.md` | Local Postgres, migration order, auth notes |
| `SUPABASE.md` | Step-by-step Supabase project, SQL, Storage, env vars |
| `.env.example` | All configuration keys |

## Project layout

```
src/
  config/       env validation, database pool, CORS, Supabase client
  controllers/  route handlers
  middleware/   JWT auth, roles, errors, rate limits, logging
  models/       SQL migrations (run in numeric order)
  routes/       Express routers
  services/     DB and storage logic
  utils/        helpers (AppError, catchAsync)
server.js       HTTP server, graceful shutdown
```

## Security notes

- Auth routes are **rate-limited** (`express-rate-limit`).
- Use **`SUPABASE_SERVICE_ROLE_KEY`** only on the server for Storage.
- In production, set `NODE_ENV=production` and use a strong `JWT_SECRET`.
