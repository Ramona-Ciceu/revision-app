"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("Creating account...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Check Supabase Authentication → Users.");
  }

  async function login() {
    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          Account
        </p>

        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Login to Revision Buddy
        </h1>

        <div className="mt-8 space-y-6">
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <div className="rounded-3xl border-soft bg-warning p-5">
              <p className="whitespace-pre-wrap font-bold text-[var(--foreground)]">
                {message}
              </p>
            </div>
          )}

          <button onClick={login} className="btn-primary w-full">
            Login
          </button>

          <button
            onClick={signUp}
            className="min-h-[60px] w-full rounded-full border border-[var(--border)] px-8 font-bold text-muted transition hover:bg-soft"
          >
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}