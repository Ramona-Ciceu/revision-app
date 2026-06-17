"use client";

import { useState } from "react";
import AppHeader from "@/components/app-header";
import { supabase } from "@/lib/supabaseClient";
import { createTopicKey } from "@/lib/createTopicKey";
import type { RevisionSet, RevisionTopic } from "../../types/topic";

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

      const finalTopics: RevisionTopic[] = [];

      for (const topicTitle of topics) {
        const topicKey = createTopicKey(subject, ageLevel, topicTitle);

        const { data: existingLibraryTopic, error: librarySearchError } =
          await supabase
            .from("topic_library")
            .select("*")
            .eq("topic_key", topicKey)
            .maybeSingle();

        if (librarySearchError) {
          throw new Error(librarySearchError.message);
        }

        let topicLibraryId = existingLibraryTopic?.id;
        let topicContent: RevisionTopic | null = existingLibraryTopic?.content;

        if (!existingLibraryTopic) {
          const response = await fetch("/api/generate-revision", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject,
              ageLevel,
              topics: [topicTitle],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to generate revision content.");
          }

          const generatedSet = await response.json();
          topicContent = generatedSet.topics[0];

          const { data: insertedLibraryTopic, error: insertLibraryError } =
            await supabase
              .from("topic_library")
              .insert({
                subject,
                topic: topicTitle,
                level: ageLevel,
                topic_key: topicKey,
                content: topicContent,
              })
              .select()
              .single();

          if (insertLibraryError) {
            throw new Error(insertLibraryError.message);
          }

          topicLibraryId = insertedLibraryTopic.id;
        }

        if (!topicLibraryId || !topicContent) {
          throw new Error(`Could not load topic: ${topicTitle}`);
        }

        const { data: existingUserRevision, error: userRevisionSearchError } =
          await supabase
            .from("user_revision_sets")
            .select("*")
            .eq("user_id", user.id)
            .eq("topic_library_id", topicLibraryId)
            .maybeSingle();

        if (userRevisionSearchError) {
          throw new Error(userRevisionSearchError.message);
        }

        let userRevisionSetId = existingUserRevision?.id;
        let revised = existingUserRevision?.revised ?? false;

        if (!existingUserRevision) {
          const { data: insertedUserRevision, error: insertUserRevisionError } =
            await supabase
              .from("user_revision_sets")
              .insert({
                user_id: user.id,
                topic_library_id: topicLibraryId,
                revised: false,
                user_notes: "",
              })
              .select()
              .single();

          if (insertUserRevisionError) {
            throw new Error(insertUserRevisionError.message);
          }

          userRevisionSetId = insertedUserRevision.id;
          revised = false;
        }

        finalTopics.push({
          ...topicContent,
          topicLibraryId,
          userRevisionSetId,
          revised,
        });
      }

      const revisionSet: RevisionSet = {
        subject,
        ageLevel,
        topics: finalTopics,
      };

      localStorage.setItem("revision-set", JSON.stringify(revisionSet));
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
    <main className="page">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="card card-large mx-auto">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Create revision set
          </p>

          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            Add one subject with multiple topics
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
            The app checks the shared topic library first. If a topic is not
            saved yet, Gemini creates it and saves it for future use.
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
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-bold text-[var(--foreground)]">
                  Year Group / Level
                </label>

                <input
                  className="input"
                  placeholder="Example: Year 7"
                  value={ageLevel}
                  onChange={(event) => setAgeLevel(event.target.value)}
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
                  onChange={(event) => setTopicsText(event.target.value)}
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
                {isGenerating ? "Checking library..." : "Create Revision"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}