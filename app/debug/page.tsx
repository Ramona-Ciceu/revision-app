export default function DebugPage() {
  return (
    <main className="page-center">
      <section className="card card-large">
        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Debug Supabase
        </h1>

        <div className="mt-8 space-y-4 text-lg">
          <p>
            URL:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL
              ? "Loaded"
              : "Missing"}
          </p>

          <p>
            Key:{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? "Loaded"
              : "Missing"}
          </p>
        </div>
      </section>
    </main>
  );
}