import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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
        flow: isSignUp ? "signUp" : "signIn",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Wordmark */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            Узунов
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (isSignUp ? "Creating account…" : "Signing in…") : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>

          {/* TODO: Remove sign-up toggle after bootstrapping admin account */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-foreground font-medium hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}