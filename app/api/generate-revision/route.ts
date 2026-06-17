import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type RevisionGeneratedTopic = {
  title: string;
  definition?: string;
  keyInfo: string[];
  example: string;
  exampleExplanation: string;
  bbcSearchUrl?: string;
  userNotes: string;
  revised: boolean;
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { subject, ageLevel, topics } = body;

    if (!subject || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: "Subject and topics are required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a UK secondary school revision tutor.

Create useful revision content for:
Subject: ${subject}
Year group: ${ageLevel || "Not specified"}

Topics:
${topics.map((topic: string, index: number) => `${index + 1}. ${topic}`).join("\n")}

Return ONLY valid JSON. No markdown. No code block. No extra text.

Use this exact structure:

{
  "subject": "${subject}",
  "ageLevel": "${ageLevel || ""}",
  "topics": [
    {
      "title": "Fractions",
      "definition": "A fraction is a number that shows part of a whole.",
      "keyInfo": [
        "The numerator is the top number.",
        "The denominator is the bottom number.",
        "Equivalent fractions have the same value.",
        "To add fractions, use a common denominator.",
        "Fractions can be simplified by dividing the top and bottom by the same number."
      ],
      "example": "1/4 + 2/4 = 3/4",
      "exampleExplanation": "The denominators are already the same, so add the numerators: 1 + 2 = 3. Keep the denominator as 4.",
      "bbcSearchUrl": "https://www.bbc.co.uk/bitesize/search?q=Fractions",
      "userNotes": "",
      "revised": false,
      "quiz": [
        {
          "question": "What is 1/5 + 2/5?",
          "options": ["3/5", "3/10", "2/25", "1/10"],
          "answer": "3/5",
          "explanation": "The denominators are the same, so add the numerators: 1 + 2 = 3."
        }
      ]
    }
  ]
}

Rules:
- Create exactly one topic object for every topic listed.
- Make definition specific and clear.
- Make keyInfo specific to the topic, not generic.
- For maths, include real worked examples with numbers.
- Explain every example clearly.
- Create one useful multiple-choice question per topic.
- Use simple wording suitable for ${ageLevel || "a school student"}.
- For bbcSearchUrl, use: https://www.bbc.co.uk/bitesize/search?q=TOPIC
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = result.text;

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned empty content." },
        { status: 500 }
      );
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    parsed.topics = parsed.topics.map((topic: RevisionGeneratedTopic) => ({
      ...topic,
      definition: topic.definition || `A short explanation of ${topic.title}.`,
      bbcSearchUrl:
        topic.bbcSearchUrl ||
        `https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(
          topic.title
        )}`,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gemini failed to generate revision content.",
      },
      { status: 500 }
    );
  }
}