"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. You can now log in.");
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
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