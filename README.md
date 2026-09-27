# CodeLearn

Learn HTML, CSS and JavaScript in the browser. Every lesson has a live editor
with a sandboxed preview, quizzes, coding challenges with automated tests, and
multi-file projects. Progress, XP, streaks, badges and certificates are all
stored server-side.

Built with Next.js (App Router), Prisma and PostgreSQL, Tailwind CSS and Radix UI.

## Requirements

- Node.js 22
- A PostgreSQL database (local server, or a hosted one such as Neon or Supabase)

## Local development

```bash
npm install          # also runs `prisma generate`
cp .env.example .env # then set DATABASE_URL and SESSION_SECRET
npm run db:migrate   # create the schema
npm run db:seed      # load the courses, challenges, projects and demo accounts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed creates two accounts:

| Account | Email | Password |
| --- | --- | --- |
| Learner | `demo@codelearn.dev` | `demo12345` |
| Admin | `admin@codelearn.dev` | `admin12345` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Create/apply a migration in development |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Load seed content |
| `npm run db:reset` | Drop, re-migrate and re-seed |

## Deploying to Vercel

1. Provision a PostgreSQL database and copy its connection string. Add
   `?sslmode=require` if your provider requires it.
2. Import the repository at **Settings → General → Build & Development Settings**:

   - Build command: `npm run build` (the default)
   - Install command: `npm install` (the default — `postinstall` runs
     `prisma generate`)

3. Add these environment variables, for both Production and Preview:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `SESSION_SECRET` | A long random value — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |

4. Apply the schema to the database once, from your machine:

   ```bash
   DATABASE_URL="postgresql://..." npm run db:deploy
   DATABASE_URL="postgresql://..." npm run db:seed   # optional demo content
   ```

Migrations are deliberately **not** run during the Vercel build: a preview
deploy would otherwise migrate the production database. Run `npm run db:deploy`
whenever a new migration is added.

## Notes on the architecture

- **Content is data.** Courses, lessons, challenges, projects, achievements and
  learning paths live in the database and are seeded from `prisma/seed/`. Adding
  a badge or a lesson is a seed change, not a code change.
- **Structured columns are JSON strings** (`src/lib/json.ts`), so the schema
  stays portable and a malformed row degrades to a default instead of throwing.
- **User code never runs on the server.** The preview iframe is sandboxed
  without `allow-same-origin`, so it has no access to the app's DOM, cookies or
  session. Challenge tests execute inside that iframe and report back over
  `postMessage`; the server re-checks the report before awarding XP.
- **Auth is database-backed.** A session token is stored in a `Session` row and
  the cookie is an HMAC-signed version of that token, so a leaked database row
  cannot be replayed. All writes are filtered by the session's user id, never by
  a value from the client.
