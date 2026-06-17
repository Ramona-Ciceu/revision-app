"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/app-header";
import type { RevisionSet } from "../types/topic";

export default function QuizPage() {
  const [revisionSet, setRevisionSet] = useState<RevisionSet | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("revision-set");

    if (saved) {
      setRevisionSet(JSON.parse(saved));
    }
  }, []);

  function selectAnswer(questionKey: string, answer: string) {
    setAnswers({
      ...answers,
      [questionKey]: answer,
    });
  }

  function finishQuiz() {
    if (!revisionSet) return;

    let total = 0;

    revisionSet.topics.forEach((topic, topicIndex) => {
      topic.quiz.forEach((question, questionIndex) => {
        const key = `${topicIndex}-${questionIndex}`;

        if (answers[key] === question.answer) {
          total += 1;
        }
      });
    });

    setScore(total);
  }

  if (!revisionSet) {
    return (
      <main className="page">
        <div className="mx-auto max-w-5xl">
          <AppHeader />

          <section className="card card-large mx-auto">
            <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
              No quiz found
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

  const totalQuestions = revisionSet.topics.reduce(
    (total, topic) => total + topic.quiz.length,
    0
  );

  const answeredQuestions = Object.keys(answers).length;

  return (
    <main className="page">
      <div className="mx-auto max-w-5xl">
        <AppHeader />

        <section className="card p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Multiple choice quiz
          </p>

          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            {revisionSet.subject} Quiz
          </h1>

          <p className="mt-4 text-lg leading-8 text-muted">
            Answer each question, then check your score.
          </p>

          <div className="mt-10 grid gap-6">
            {revisionSet.topics.map((topic, topicIndex) =>
              topic.quiz.map((question, questionIndex) => {
                const questionKey = `${topicIndex}-${questionIndex}`;
                const selectedAnswer = answers[questionKey];
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article
                    key={questionKey}
                    className="rounded-3xl border-soft bg-card p-6 shadow-sm"
                  >
                    <p className="text-sm font-bold uppercase tracking-wider text-muted">
                      {topic.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                      {question.question}
                    </h2>

                    <div className="mt-6 space-y-4">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => selectAnswer(questionKey, option)}
                          className={`block w-full rounded-2xl border p-5 text-left text-lg font-semibold transition ${
                            selectedAnswer === option
                              ? "border-[var(--primary)] bg-soft text-[var(--foreground)]"
                              : "border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-soft"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {score !== null && (
                      <div
                        className={`mt-5 rounded-3xl border-soft p-5 ${
                          isCorrect ? "bg-success" : "bg-warning"
                        }`}
                      >
                        <p className="font-bold text-[var(--foreground)]">
                          {isCorrect ? "Correct" : "Not quite"}
                        </p>

                        <p className="mt-2 text-muted">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          <div className="btn-row">
            <button
              onClick={finishQuiz}
              className="btn-primary w-full sm:w-auto"
              disabled={answeredQuestions !== totalQuestions}
            >
              Finish Quiz
            </button>
          </div>

          {score !== null && (
            <div className="mt-8 rounded-3xl border-soft bg-soft p-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Score: {score}/{totalQuestions}
              </h2>

              <p className="mt-3 text-lg text-muted">
                Review the explanations above and revise any topics you missed.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}