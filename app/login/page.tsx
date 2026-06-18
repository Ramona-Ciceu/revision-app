"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email address and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage(
          "Account created successfully. Please check your email and click the confirmation link."
        );

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          Account
        </p>

        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          {mode === "signup"
            ? "Create your account"
            : "Welcome back"}
        </h1>

        <p className="mt-4 text-lg leading-8 text-muted">
          {mode === "signup"
            ? "Create your Revision Buddy account."
            : "Sign in to continue revising."}
        </p>
<div className="mt-8 grid grid-cols-2 rounded-full border border-[var(--border)] bg-soft p-2">
  <button
    type="button"
    onClick={() => {
      setMode("login");
      setMessage("");
    }}
    className={`rounded-full px-5 py-3 font-bold transition ${
      mode === "login"
        ? "bg-white text-[var(--foreground)] shadow-sm"
        : "text-muted"
    }`}
  >
    Login
  </button>

  <button
    type="button"
    onClick={() => {
      setMode("signup");
      setMessage("");
    }}
    className={`rounded-full px-5 py-3 font-bold transition ${
      mode === "signup"
        ? "bg-white text-[var(--foreground)] shadow-sm"
        : "text-muted"
    }`}
  >
    Create Account
  </button>
</div>

        <div className="mt-8 space-y-6">
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />

          <div className="relative">
            <input
              className="input pr-14"
              type={showPassword ? "text" : "password"}
              placeholder={
                mode === "signup"
                  ? "Create a password"
                  : "Enter your password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--color-mauve-600)] transition hover:text-[var(--foreground)]"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {message && (
            <div className="rounded-3xl border-soft bg-warning p-5">
              <p className="whitespace-pre-wrap font-bold text-[var(--foreground)]">
                {message}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleAuth}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Login"}
          </button>

          <p className="text-center text-sm text-muted">
            {mode === "signup"
              ? "Already have an account? Click Login above."
              : "New here? Click Create Account above."}
          </p>
        </div>
      </section>
    </main>
  );
}