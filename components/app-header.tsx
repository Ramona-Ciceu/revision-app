"use client";

import { useEffect, useState } from "react";
import { BookOpen, Home, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AppHeader() {
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "New Revision",
      href: "/topics/new",
      icon: PlusCircle,
    },
    {
      label: "Quiz",
      href: "/quiz",
      icon: BookOpen,
    },
  ];

  return (
    <header className="sticky top-4 z-50 mb-8">
      <nav className="rounded-full border border-[var(--border)] bg-white/90 px-5 py-3 shadow-md backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <a href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-soft font-extrabold text-[var(--foreground)]">
              RB
            </div>

            <div>
              <p className="text-lg font-extrabold text-[var(--foreground)]">
                Revision Buddy
              </p>

              <p className="hidden text-xs font-semibold text-muted sm:block">
                Welcome, {displayName}
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-muted transition hover:bg-soft hover:text-[var(--foreground)]"
                >
                  <Icon size={17} />
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="max-w-[220px] truncate rounded-full bg-soft px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
              {userEmail}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 border-t border-[var(--border)] pt-4 md:hidden">
            <p className="mb-3 rounded-2xl bg-soft p-4 text-sm font-semibold text-[var(--foreground)]">
              {userEmail}
            </p>

            <div className="grid gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-muted transition hover:bg-soft hover:text-[var(--foreground)]"
                  >
                    <Icon size={18} />
                    {link.label}
                  </a>
                );
              })}

              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700 transition hover:bg-red-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}