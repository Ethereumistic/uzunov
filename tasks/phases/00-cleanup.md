# Phase 00 — Cleanup: Remove better-auth & Nuke Placeholder Convex Tables

> **Prerequisite:** None. This is the first phase.
> **Commit message suggestion:** `chore: remove better-auth and nuke placeholder convex tables`

---

## Objective

Remove the existing `better-auth` integration (which is being replaced by `@convex-dev/auth`) and delete all placeholder Convex tables/functions that came from scaffolding (products, todos). This gives us a clean slate before installing the real auth system and defining the real schema.

---

## Step-by-step

### 0.1 — Uninstall `better-auth` package

```bash
vp remove better-auth
```

### 0.2 — Delete better-auth files

Delete these files:
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/integrations/better-auth/header-user.tsx`
- The entire directory `src/integrations/better-auth/`

Also remove the `src/routes/demo/better-auth.tsx` route file (it references better-auth).

### 0.3 — Remove better-auth env vars from `.env.local`

Remove these lines from `.env.local`:
```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=57d51dd70452049caea39e8c2d8bc49f752c16c14b12bcb25ef05cb21b67355f
```

### 0.4 — Nuke placeholder Convex tables

Replace the entire content of `convex/schema.ts` with just the imports (empty schema — Phase 2 will add the real tables):

```ts
import { defineSchema } from "convex/server";

export default defineSchema({
  // Real tables added in Phase 2
});
```

### 0.5 — Delete placeholder Convex function file

Delete `convex/todos.ts`.

### 0.6 — Verify cleanup compiles

```bash
vp run dev
```

Confirm the app starts without errors. The Convex dashboard should show an empty schema (no tables). The demo table route (`/demo/table`) may need a small fix if it imported from todos — check and either remove it or skip it.

---

## Files Touched

| Action | Path |
|--------|------|
| DELETE | `src/lib/auth.ts` |
| DELETE | `src/lib/auth-client.ts` |
| DELETE | `src/integrations/better-auth/` (entire directory) |
| DELETE | `src/routes/demo/better-auth.tsx` |
| DELETE | `convex/todos.ts` |
| EDIT | `.env.local` (remove better-auth vars) |
| EDIT | `convex/schema.ts` (nuke placeholder tables) |

---

## Validation Checklist

- [ ] `better-auth` removed from `package.json`
- [ ] No import statements reference `better-auth` anywhere in `src/`
- [ ] No import statements reference `todos` from `convex/todos` anywhere
- [ ] `convex/schema.ts` has no table definitions
- [ ] App starts with `vp run dev` without errors
- [ ] Existing public pages (`/`, `/projects`) still render correctly