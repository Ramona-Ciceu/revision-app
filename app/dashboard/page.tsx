"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/app-header";
import { supabase } from "@/lib/supabaseClient";
import type { RevisionSet, RevisionTopic } from "../../types/topic";

type SavedRevisionRow = {
  id: string;
  revised: boolean;
  user_notes: string | null;
  topic_library: {
    id: string;
    subject: string;
    topic: string;
    level: string | null;
    content: RevisionTopic;
  };
};

export default function DashboardPage() {
  const [savedTopics, setSavedTopics] = useState<SavedRevisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSavedTopics();
  }, []);

  async function loadSavedTopics() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("user_revision_sets")
      .select(
        `
        id,
        revised,
        user_notes,
        topic_library (
          id,
          subject,
          topic,
          level,
          content
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSavedTopics((data || []) as unknown as SavedRevisionRow[]);
    setLoading(false);
  }

  function openTopic(row: SavedRevisionRow) {
    const topicContent: RevisionTopic = {
      ...row.topic_library.content,
      revised: row.revised,
      userNotes: row.user_notes || "",
      topicLibraryId: row.topic_library.id,
      userRevisionSetId: row.id,
    };

    const revisionSet: RevisionSet = {
      subject: row.topic_library.subject,
      ageLevel: row.topic_library.level || "",
      topics: [topicContent],
    };

    localStorage.setItem("revision-set", JSON.stringify(revisionSet));
    window.location.href = "/topics/preview";
  }

  return (
    <main className="page">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="card p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-muted">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--foreground)]">
            Your Revision Topics
          </h1>

          <div className="btn-row">
            <a href="/topics/new" className="btn-primary w-full sm:w-auto">
              Create New Revision
            </a>
          </div>

          {message && (
            <div className="mt-6 rounded-3xl border-soft bg-warning p-5">
              <p className="font-bold text-[var(--foreground)]">{message}</p>
            </div>
          )}

          {loading && (
            <div className="mt-10 rounded-3xl border-soft bg-soft p-6">
              <p className="text-lg font-bold text-muted">
                Loading saved revision topics...
              </p>
            </div>
          )}

          {!loading && savedTopics.length === 0 && (
            <div className="mt-10 rounded-3xl border-soft bg-soft p-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                No saved topics yet
              </h2>

              <p className="mt-3 text-muted">
                Create your first revision topic and it will appear here.
              </p>
            </div>
          )}

          {!loading && savedTopics.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {savedTopics.map((row) => (
                <article
                  key={row.id}
                  className="rounded-3xl border-soft bg-card p-6 shadow-sm"
                >
                  <p className="text-sm font-bold uppercase tracking-wider text-muted">
                    {row.topic_library.subject}{" "}
                    {row.topic_library.level
                      ? `• ${row.topic_library.level}`
                      : ""}
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold text-[var(--foreground)]">
                    {row.topic_library.topic}
                  </h2>

                  <p className="mt-3 text-muted">
                    {row.revised ? "Revised" : "Not revised yet"}
                  </p>

                  <button
                    onClick={() => openTopic(row)}
                    className="btn-primary mt-6 w-full sm:w-auto"
                  >
                    Open Revision
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}