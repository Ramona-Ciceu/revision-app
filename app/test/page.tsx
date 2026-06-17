"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [message, setMessage] = useState("");

  async function testDatabase() {
    const { data, error } = await supabase
      .from("test_connection")
      .insert([
        {
          message: "Hello from Revision Buddy",
        },
      ])
      .select();

    if (error) {
      console.error(error);
      setMessage("Database test failed");
      return;
    }

    console.log(data);
    setMessage("Database connected successfully");
  }

  return (
    <main className="page-center">
      <section className="card card-large">
        <h1 className="text-3xl font-bold">Supabase Test</h1>

        <button onClick={testDatabase} className="btn-primary mt-6">
          Test Database
        </button>

        {message && <p className="mt-6 text-lg">{message}</p>}
      </section>
    </main>
  );
}
