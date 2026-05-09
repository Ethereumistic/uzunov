# Phase 01 — Install & Configure Convex Auth

> **Prerequisite:** Phase 00 completed (better-auth removed, placeholder tables nuked).
> **Commit message suggestion:** `feat: install and configure @convex-dev/auth with Password provider`

---

## Objective

Set up `@convex-dev/auth` with the Password (email+password) provider, wire the HTTP routes, add auth tables to the Convex schema, wrap the app root with `ConvexAuthProvider`, and verify the auth flow works by creating an admin user.

---

## Step-by-step

### 1.1 — Install packages

```bash
vp install @convex-dev/auth
```

This should also pull in `@auth/core` as a dependency.

### 1.2 — Create `convex/auth.ts`

```ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});
```

### 1.3 — Create `convex/http.ts`

```ts
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);
export default http;
```

### 1.4 — Add auth tables to `convex/schema.ts`

```ts
import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Project tables added in Phase 2
});
```

### 1.5 — Add environment variables

Add to `.env.local`:

```
CONVEX_SITE_URL=http://localhost:3000
AUTH_SECRET=<generate with: openssl rand -hex 32>
```

Also set `AUTH_SECRET` in the Convex deployment dashboard under **Settings → Environment Variables**. The `VITE_CONVEX_SITE_URL` key already exists in `.env.local` (pointing to the deployment URL); `CONVEX_SITE_URL` is the server-side counterpart that `@convex-dev/auth` needs.

### 1.6 — Update `src/integrations/convex/provider.tsx`

The current provider only wraps with `ConvexProvider`. It needs to also wrap with `ConvexAuthProvider`:

```tsx
import { ConvexProvider } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}

const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

export default function AppConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      <ConvexAuthProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}
```

**Important:** `ConvexAuthProvider` must be nested inside `ConvexProvider`. Both receive the same `convexClient` instance.

### 1.7 — Run Convex dev to push schema

```bash
vp dlx convex dev
```

Wait for the schema to sync. Check the Convex dashboard — you should see the auth tables (`users`, `sessions`, `accounts`, `verificationCodes`) appear.

### 1.8 — Bootstrap the admin user

The simplest way with the Password provider is to use the sign-up flow from the frontend once. For now:

1. Temporarily allow sign-up by calling `signIn("password", { email, password, flow: "signUp" })` from the browser console or a temporary route.
2. After the admin user is created, verify it appears in the Convex dashboard under `users`.
3. Once confirmed, remove any temporary sign-up code. The production config only allows `flow: "signIn"`.

**Alternative:** Create a one-time internal mutation in `convex/seedAdmin.ts`:

```ts
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createAdmin = internalMutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // The Password provider's hashing is handled internally.
    // Use the auth system: you can call the signIn/signUp action from a client
    // or use the dashboard to run this mutation after wiring the provider.
    // For now, just sign up from the frontend once.
  },
});
```

For the simplest bootstrapping path, just use the login page's sign-up flow once (see Phase 08).

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `convex/auth.ts` |
| CREATE | `convex/http.ts` |
| EDIT | `convex/schema.ts` (add authTables) |
| EDIT | `.env.local` (add CONVEX_SITE_URL, AUTH_SECRET) |
| EDIT | `src/integrations/convex/provider.tsx` (add ConvexAuthProvider) |

---

## Validation Checklist

- [ ] `@convex-dev/auth` appears in `package.json` dependencies
- [ ] `convex/auth.ts` exists with Password provider configured
- [ ] `convex/http.ts` exists with auth HTTP routes registered
- [ ] `convex/schema.ts` includes `authTables` spread
- [ ] Convex dashboard shows auth tables (`users`, `sessions`, `accounts`, `verificationCodes`)
- [ ] App starts without errors
- [ ] `ConvexAuthProvider` wraps the app root
- [ ] AUTH_SECRET is set both in `.env.local` and Convex dashboard