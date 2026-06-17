"use client";

import { useEffect, useState } from "react";
import { RevisionSet } from "@/types/topic";

type Question = {
  topic: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

function createQuestions(revisionSet: RevisionSet): Question[] {
  return revisionSet.topics.map((topic) => ({
    topic: topic.title,
    question: `What is the best way to revise ${topic.title}?`,
    options: [
      "Break it into key points and use examples",
      "Only read it once very quickly",
      "Ignore the difficult words",
      "Guess the answer without checking",
    ],
    answer: "Break it into key points and use examples",
    explanation:
      "Breaking a topic into key points and examples makes it easier to understand and remember.",
  }));
}

export default function QuizPage() {
  const [revisionSet, setRevisionSet] = useState<RevisionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("revision-set");

    if (saved) {
      const parsedSet: RevisionSet = JSON.parse(saved);
      setRevisionSet(parsedSet);
      setQuestions(createQuestions(parsedSet));
    }
  }, []);

  function selectAnswer(questionIndex: number, answer: string) {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  }

  function finishQuiz() {
    const totalScore = questions.reduce((total, question, index) => {
      return answers[index] === question.answer ? total + 1 : total;
    }, 0);

    setScore(totalScore);
  }

  if (!revisionSet) {
    return (
      <main className="page-center">
        <section className="card card-large">
          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            No quiz found
          </h1>

          <p className="mt-4 text-lg text-muted">
            Create a revision set first.
          </p>

          <div className="btn-row">
            <a href="/topics/new" className="btn-primary w-full sm:w-auto">
              Create Revision Set
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="mx-auto max-w-4xl">
        <section className="card p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Multiple choice quiz
          </p>

          <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
            {revisionSet.subject} Quiz
          </h1>

          <p className="mt-4 text-lg leading-8 text-muted">
            Answer one question for each topic.
          </p>

          <div className="mt-10 grid gap-6">
            {questions.map((question, index) => (
              <article
                key={question.topic}
                className="rounded-3xl border-soft bg-card p-6"
              >
                <p className="text-sm font-bold uppercase tracking-wider text-muted">
                  {question.topic}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {question.question}
                </h2>

                <div className="mt-6 space-y-4">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => selectAnswer(index, option)}
                      className={`block w-full rounded-2xl border p-5 text-left text-lg font-semibold transition ${
                        answers[index] === option
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
                      answers[index] === question.answer
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    <p className="font-bold text-[var(--foreground)]">
                      {answers[index] === question.answer
                        ? "Correct"
                        : "Not quite"}
                    </p>

                    <p className="mt-2 text-muted">{question.explanation}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="btn-row">
            <button
              onClick={finishQuiz}
              className="btn-primary w-full sm:w-auto"
              disabled={Object.keys(answers).length !== questions.length}
            >
              Finish Quiz
            </button>
          </div>

          {score !== null && (
            <div className="mt-8 rounded-3xl border-soft bg-soft p-6">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Score: {score}/{questions.length}
              </h2>

              <p className="mt-3 text-lg text-muted">
                Review the explanations above and try again when ready.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}