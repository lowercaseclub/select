# Supabase Select

Developer conference website for Supabase Select.

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Structure

- `apps/2026/` - **Main Next.js application** (current year — served at the root domain)
- `apps/2025/` - Previous year's app (archived; dependencies frozen)
- `packages/ui-2026/`, `packages/typescript-config-2026/` - Shared packages used by the 2026 app
- `packages/ui/`, `packages/typescript-config/` - Shared packages used by the 2025 app

## Deployment

The production **root domain is served by the `apps/2026` app**. On Vercel this is set by the
project's **Root Directory** (`apps/2026`) — there is no repo-level routing file. To roll the site
over to a new year, duplicate the current app and its `packages/*-<year>` packages, then point the
Vercel project's Root Directory at the new app.
