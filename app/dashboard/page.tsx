export default function DashboardPage() {
  return (
    <main className="page">
      <div className="mx-auto max-w-4xl">
        <section className="card card-large">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Welcome back
          </p>

          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            Revision Buddy
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
            Create revision notes, examples and quizzes from any topic.
          </p>

          <div className="btn-row">
            <a href="/topics/new" className="btn-primary w-full sm:w-auto">
              Create New Topic
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}