"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    setMessage("");

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "If an account exists for this email address, a password reset link has been sent."
      );
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
          Password reset
        </p>

        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Forgot your password?
        </h1>

        <p className="mt-4 text-lg leading-8 text-muted">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <div className="mt-8 space-y-6">
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />

          {message && (
            <div className="rounded-3xl border-soft bg-warning p-5">
              <p className="whitespace-pre-wrap font-bold text-[var(--foreground)]">
                {message}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetPassword}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-muted">
            <Link
              href="/login"
              className="font-bold text-[var(--color-mauve-600)] hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}