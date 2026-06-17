"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/app-header";
import type { RevisionSet } from "../../types/topic";
import { supabase } from "@/lib/supabaseClient";

export default function PreviewTopicPage() {
  const [revisionSet, setRevisionSet] = useState<RevisionSet | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("revision-set");

    if (saved) {
      setRevisionSet(JSON.parse(saved));
    }
  }, []);

  async function updateRevisedStatus(topicIndex: number, revised: boolean) {
    if (!revisionSet) return;

    const updatedSet = {
      ...revisionSet,
      topics: revisionSet.topics.map((topic, index) =>
        index === topicIndex ? { ...topic, revised } : topic
      ),
    };

    setRevisionSet(updatedSet);
    localStorage.setItem("revision-set", JSON.stringify(updatedSet));

    const revisionSetId = localStorage.getItem("revision-set-id");

    if (revisionSetId) {
      const { error } = await supabase
        .from("revision_sets")
        .update({
          content: updatedSet,
        })
        .eq("id", revisionSetId);

      if (error) {
        console.error("Failed to update revised status:", error.message);
      }
    }
  }

  if (!revisionSet) {
    return (
      <main className="page">
        <div className="mx-auto max-w-5xl">
          <AppHeader />

          <section className="card card-large mx-auto">
            <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
              No revision set found
            </h1>

            <p className="mt-4 text-lg leading-8 text-muted">
              Create a revision set first.
            </p>

            <div className="btn-row">
              <a href="/topics/new" className="btn-primary w-full sm:w-auto">
                Create Revision Set
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const revisedCount = revisionSet.topics.filter(
    (topic) => topic.revised
  ).length;

  return (
    <main className="page">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="card p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Revision preview
          </p>

          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            {revisionSet.subject}
          </h1>

          <p className="mt-3 text-lg leading-8 text-muted">
            {revisionSet.ageLevel || "Year group not added"} • {revisedCount}/
            {revisionSet.topics.length} topics revised
          </p>

          <div className="mt-10 grid gap-6">
            {revisionSet.topics.map((topic, index) => (
              <article
                key={`${topic.title}-${index}`}
                className="rounded-3xl border-soft bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted">
                      Topic {index + 1}
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">
                      {topic.title}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      topic.revised ? "bg-success" : "bg-soft text-muted"
                    }`}
                  >
                    {topic.revised ? "Revised" : "Not revised yet"}
                  </span>
                </div>

                <div className="mt-6 rounded-3xl border-soft bg-soft p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    Definition
                  </h3>

                  <p className="mt-3 text-lg leading-8 text-muted">
                    {topic.definition || "No definition available yet."}
                  </p>
                </div>

                <div className="mt-5 rounded-3xl border-soft bg-card p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    Key Information
                  </h3>

                  <ul className="mt-4 ml-6 list-disc space-y-2 text-lg leading-8 text-muted">
                    {topic.keyInfo.map((point, pointIndex) => (
                      <li key={`${topic.title}-key-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 rounded-3xl border-soft bg-card p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    Example
                  </h3>

                  <p className="mt-3 text-lg leading-8 text-muted">
                    {topic.example}
                  </p>

                  <details className="mt-5 rounded-3xl border-soft bg-soft p-5">
                    <summary className="cursor-pointer text-lg font-bold text-[var(--foreground)]">
                      Show explanation
                    </summary>

                    <p className="mt-4 text-lg leading-8 text-muted">
                      {topic.exampleExplanation}
                    </p>
                  </details>
                </div>

                <div className="mt-5 rounded-3xl border-soft bg-soft p-6">
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    Useful Resource
                  </h3>

                  <p className="mt-3 text-lg leading-8 text-muted">
                    Open BBC Bitesize to find extra explanations, videos and
                    practice for this topic.
                  </p>

                  <a
                    href={
                      topic.bbcSearchUrl ||
                      `https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(
                        topic.title
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-5 w-full sm:w-auto"
                  >
                    Open BBC Bitesize
                  </a>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {!topic.revised ? (
                    <button
                      onClick={() => updateRevisedStatus(index, true)}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Mark as Revised
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRevisedStatus(index, false)}
                      className="min-h-[60px] rounded-full border border-[var(--border)] px-8 font-bold text-muted transition hover:bg-soft"
                    >
                      Mark as Not Revised
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="btn-row">
            <a href="/quiz" className="btn-primary w-full sm:w-auto">
              Start Multiple Choice Quiz
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}