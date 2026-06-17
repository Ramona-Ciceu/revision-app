"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createTopicKey } from "@/lib/createTopicKey";

export default function NewTopicPage() {
  const [subject, setSubject] = useState("");
  const [ageLevel, setAgeLevel] = useState("");
  const [topicsText, setTopicsText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");

    const topics = topicsText
      .split("\n")
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 0);

    if (topics.length === 0) {
      setErrorMessage("Please add at least one topic.");
      return;
    }

    try {
      setIsGenerating(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const topicKey = createTopicKey(subject, ageLevel, topics);

      const { data: existingSet, error: existingError } = await supabase
        .from("revision_sets")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic_key", topicKey)
        .maybeSingle();

      if (existingError) {
        throw new Error(existingError.message);
      }

      if (existingSet) {
        localStorage.setItem("revision-set-id", existingSet.id);
        localStorage.setItem(
          "revision-set",
          JSON.stringify(existingSet.content)
        );

        window.location.href = "/topics/preview";
        return;
      }

      const response = await fetch("/api/generate-revision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          ageLevel,
          topics,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate revision content.");
      }

      const responseText = await response.text();
      const generatedRevision = JSON.parse(responseText);

      const { data: insertedSet, error: insertError } = await supabase
        .from("revision_sets")
        .insert({
          user_id: user.id,
          subject,
          age_level: ageLevel,
          topic_key: topicKey,
          content: generatedRevision,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      localStorage.setItem("revision-set-id", insertedSet.id);
      localStorage.setItem("revision-set", JSON.stringify(generatedRevision));

      window.location.href = "/topics/preview";
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Sorry, the revision content could not be generated."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          Create revision set
        </p>

        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Add one subject with multiple topics
        </h1>

        <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
          If this revision set already exists, we will load it from your saved
          revision. If not, Gemini will create it.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-base font-bold text-[var(--foreground)]">
                Subject
              </label>

              <input
                className="input"
                placeholder="Example: Maths"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-bold text-[var(--foreground)]">
                Year Group
              </label>

              <input
                className="input"
                placeholder="Example: Year 7"
                value={ageLevel}
                onChange={(e) => setAgeLevel(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-bold text-[var(--foreground)]">
                Topics
              </label>

              <textarea
                className="input min-h-[180px] resize-none"
                placeholder={`Example:\nFractions\nDecimals\nPercentages`}
                value={topicsText}
                onChange={(e) => setTopicsText(e.target.value)}
                required
                disabled={isGenerating}
              />

              <p className="mt-2 text-sm text-muted">
                Put each topic on a new line.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-3xl border-soft bg-danger p-5">
              <p className="whitespace-pre-wrap font-bold text-[var(--foreground)]">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="btn-row">
            <button
              className="btn-primary w-full sm:w-auto"
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? "Checking and generating..." : "Create Revision"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}