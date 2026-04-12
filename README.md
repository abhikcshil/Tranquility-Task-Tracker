# Tranquility Task Tracker (Phase 0)

Phase 0 bootstraps a self-hosted productivity app with:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Prisma + SQLite
- PWA manifest baseline (text-only, no icons yet)

## Run locally (Windows PowerShell)

1. Install dependencies:

   npm install

2. Generate Prisma client:

   npx prisma generate

3. Push schema to local SQLite database:

   npx prisma db push

4. Start the app:

   npm run dev

5. Open:

   http://localhost:3000

## Included routes

- `/` (Dashboard placeholder)
- `/tasks`
- `/habits`
- `/notes`
- `/settings`

## Notes

- Dark mode is enabled by default.
- Layout is mobile-first with a fixed bottom navigation.
- Manifest is included without icon assets for this phase.
