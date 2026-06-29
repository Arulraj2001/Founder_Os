import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-2.5-flash for fast and smart answers
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are "FounderOS AI Advisor", an elite business strategist and AI advisor integrated into the Geometric Balance Founder Dashboard.
You analyze the founder's current workspace data and answer questions with high precision.
Here is the current workspace context:
${JSON.stringify(context, null, 2)}

Provide actionable, concise, and structured markdown recommendations. Focus on optimizing revenue, prioritizing tasks, and suggesting business actions. Keep responses under 200 words.`,
    });

    // Transform roles for Gemini API (user / model)
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const result = await model.generateContent({
      contents: formattedContents,
    });

    const responseText = result.response.text();
    return Response.json({ content: responseText });
  } catch (error: any) {
    console.error("[Gemini API Error]:", error);
    return Response.json(
      { error: error.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
