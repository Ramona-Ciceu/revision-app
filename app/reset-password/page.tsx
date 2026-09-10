"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [canResetPassword, setCanResetPassword] = useState(false);

  useEffect(() => {
    async function checkRecoverySession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setCanResetPassword(true);
      }

      setChecking(false);
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setCanResetPassword(true);
        setChecking(false);
        setMessage("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword() {
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Password updated successfully.");

      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
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

  if (checking) {
    return (
      <main className="page-center">
        <section className="card card-large">
          <p className="text-center text-muted">
            Checking password reset link...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          Password reset
        </p>

        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Create a new password
        </h1>

        <p className="mt-4 text-lg leading-8 text-muted">
          Enter your new password below.
        </p>

        {!canResetPassword ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border-soft bg-warning p-5">
              <p className="font-bold text-[var(--foreground)]">
                This password reset link is invalid or has expired.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="btn-primary w-full"
            >
              Request a new reset link
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="relative">
              <input
                className="input pr-14"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
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

            <div className="relative">
              <input
                className="input pr-14"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--color-mauve-600)] transition hover:text-[var(--foreground)]"
              >
                {showConfirmPassword ? (
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
              onClick={handleUpdatePassword}
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}