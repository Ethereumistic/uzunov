# Phase 08 — Admin Login Page

> **Prerequisite:** Phase 01 (auth setup) and Phase 07 (route structure) completed.
> **Commit message suggestion:** `feat: build admin login page with Convex Auth`

---

## Objective

Build a clean, centered login page at `/admin/login` that uses the `@convex-dev/auth` Password provider. On first use, temporarily allow sign-up to bootstrap the admin account, then revert to sign-in only.

---

## Step-by-step

### 8.1 — Implement `src/routes/admin/login.tsx`

```tsx
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to admin
  if (isAuthenticated) {
    return <Navigate to="/admin/projects" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Wordmark */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold tracking-tight text-[#1a1916]">
            Узунов
          </h1>
          <p className="text-sm text-stone-500 mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@uzunov.bg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1916] hover:bg-[#1a1916]/90 text-white"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 8.2 — Bootstrapping the admin account

On first deployment, there are no users in the database. To create the admin:

1. **Quick method:** Temporarily add a "Sign Up" flow to the login page:

```tsx
// In AdminLogin, add a toggle:
const [isSignUp, setIsSignUp] = useState(false);

// Change the signIn call:
await signIn("password", {
  email,
  password,
  flow: isSignUp ? "signUp" : "signIn",
});

// Add a toggle link at the bottom:
<p className="text-center text-sm text-stone-500">
  {isSignUp ? "Already have an account? " : "Don't have an account? "}
  <button
    type="button"
    onClick={() => setIsSignUp(!isSignUp)}
    className="text-[#1a1916] font-medium hover:underline"
  >
    {isSignUp ? "Sign in" : "Sign up"}
  </button>
</p>
```

2. Create the admin account via the sign-up flow.
3. **Immediately remove** the sign-up toggle from the login page. The production login should only allow `flow: "signIn"`.

### 8.3 — Update the admin layout auth guard

Make sure the `_layout.tsx` properly handles the login page bypass (it should not show the sidebar when on `/admin/login`):

```tsx
// In _layout.tsx, the auth guard should NOT apply to the login route itself.
// The login page does its own auth check and redirects.
// So _layout.tsx only needs to guard the inner routes.

// Option 1: Separate the login route OUTSIDE the layout.
// Currently login.tsx is inside admin/, so the layout applies.
// The layout should check: if on /admin/login, skip the guard and sidebar.

function AdminLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useRouter().state.location;
  const isLoginPage = location.pathname === "/admin/login";

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated && !isLoginPage) return <Navigate to="/admin/login" />;
  if (isLoginPage) return <Outlet />;  // No sidebar on login page

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

**Better approach:** Move the login page outside the admin layout entirely. Restructure routes:

```
src/routes/admin/
├── _layout.tsx              ← Auth guard + sidebar (for authenticated routes only)
├── index.tsx                ← Redirect to /admin/projects
└── projects/
    ├── index.tsx
    ├── new.tsx
    └── $projectId/
        └── edit.tsx

src/routes/admin-login.tsx    ← Standalone login page (NO layout)
```

This is cleaner. Adjust Phase 07's route structure accordingly. Delete `src/routes/admin/login.tsx` and create `src/routes/admin-login.tsx` instead.

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE/EDIT | `src/routes/admin-login.tsx` (or `src/routes/admin/login.tsx`) |
| EDIT | `src/routes/admin/_layout.tsx` (handle login page bypass) |

---

## Validation Checklist

- [ ] `/admin/login` (or `/admin-login`) renders the login form
- [ ] Signing in with valid credentials redirects to `/admin/projects`
- [ ] Invalid credentials show an error message
- [ ] Already-authenticated users visiting the login page redirect to `/admin/projects`
- [ ] Unauthenticated users visiting `/admin/projects` redirect to the login page
- [ ] The login page has NO sidebar
- [ ] After bootstrapping, sign-up flow is removed (only `flow: "signIn"` remains)