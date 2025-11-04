import { NextResponse } from "next/server";

export async function POST() {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime",
        voice: "verse",
        modalities: ["audio", "text"], 
        instructions: "You are a peruvian assistant.",
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error("Error creating session:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await r.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error creating session:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
