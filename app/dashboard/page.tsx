"use client";

import AppHeader from "@/components/app-header";

export default function DashboardPage() {
  return (
    <main className="page">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="card p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-muted">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--foreground)]">
            Your Revision Space
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Create revision notes, examples and quizzes from your school topics.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href="/topics/new"
              className="rounded-3xl border-soft bg-card p-8 transition hover:shadow-md"
            >
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Create Revision Set
              </h2>

              <p className="mt-3 text-muted">
                Add one subject with multiple topics and generate revision
                content.
              </p>
            </a>

            <a
              href="/topics/preview"
              className="rounded-3xl border-soft bg-card p-8 transition hover:shadow-md"
            >
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Current Revision
              </h2>

              <p className="mt-3 text-muted">
                Continue with the revision set you are currently working on.
              </p>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}