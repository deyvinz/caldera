## Caldera Web (Next.js App Router + Tailwind + PWA)

### Install

```bash
pnpm dlx create-next-app@latest web --typescript --eslint --src-dir --app --tailwind --use-pnpm
cd web
pnpm add @supabase/ssr @supabase/supabase-js swr
pnpm add class-variance-authority clsx lucide-react
pnpm add zod @tanstack/react-form @tanstack/zod-form-adapter
pnpm add react-qrcode-logo
pnpm add next-pwa tailwind-merge
```

### Env

Create `web/.env.local`:

```
NEXT_PUBLIC_API_URL=https://<api-domain>/api
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Run

```bash
pnpm dev
```

PWA: manifest and icons included. Offline page at `/offline`.

Routes:
- /destinations, /destinations/[slug]
- /packages, /packages/[slug]
- /checkout/[packageId]
- /dashboard (Supabase session required; reads only)

Config:
- Set `NEXT_PUBLIC_API_URL` to your Nest API base (e.g. `http://localhost:3001/api`).
- Public routes are SSR with `revalidate: 60` and dynamic fallback for development.
