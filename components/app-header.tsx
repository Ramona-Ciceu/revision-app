"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AppHeader() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email ?? "");
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("revision-set");
    localStorage.removeItem("revision-set-id");
    window.location.href = "/login";
  }

  const firstName = userEmail ? userEmail.split("@")[0].split(".")[0] : "";

  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : "there";

  return (
    <header className="mb-8 rounded-3xl border-soft bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--foreground)]">
            Revision Buddy
          </h1>

          <p className="mt-2 text-muted">Welcome back, {displayName}</p>

          {userEmail && (
            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {userEmail}
            </p>
          )}
        </div>

        <nav className="flex flex-wrap gap-3">
          <a
            href="/dashboard"
            className="rounded-full border border-[var(--border)] px-5 py-3 font-semibold text-muted transition hover:bg-soft"
          >
            Dashboard
          </a>

          <a
            href="/topics/new"
            className="rounded-full border border-[var(--border)] px-5 py-3 font-semibold text-muted transition hover:bg-soft"
          >
            New Revision
          </a>

          <a
            href="/quiz"
            className="rounded-full border border-[var(--border)] px-5 py-3 font-semibold text-muted transition hover:bg-soft"
          >
            Quiz
          </a>

          <button
            onClick={handleLogout}
            className="rounded-full border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}