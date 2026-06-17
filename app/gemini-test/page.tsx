"use client";

import { useState } from "react";

export default function TestGeminiPage() {
  const [result, setResult] = useState("");

  async function testGemini() {
    setResult("Testing...");

    try {
      const response = await fetch("/api/generate-revision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: "Maths",
          ageLevel: "Year 7",
          topics: ["Fractions"],
        }),
      });

      const text = await response.text();

      setResult(text);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Unknown error");
    }
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <h1 className="text-4xl font-extrabold text-[var(--foreground)]">
          Gemini Test
        </h1>

        <button onClick={testGemini} className="btn-primary mt-8">
          Test Gemini
        </button>

        <pre className="mt-8 whitespace-pre-wrap rounded-3xl border-soft bg-soft p-6 text-sm">
          {result}
        </pre>
      </section>
    </main>
  );
}