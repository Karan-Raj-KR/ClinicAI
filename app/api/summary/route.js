import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, age, complaint, diagnosis, medicines } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set. Please configure it in your environment." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an AI Clinic Assistant.
    Given the following patient details, generate a JSON object with two fields:
    1. "clinicalSummary": A professional, concise clinical summary for the doctor's records.
    2. "whatsappMessage": A friendly, reassuring WhatsApp message to send to the patient, summarizing their visit, diagnosis, and prescription in simple terms. Use emojis appropriately.

    Patient Details:
    Name: ${name}
    Age: ${age || "Not provided"}
    Chief Complaint: ${complaint}
    Diagnosis: ${diagnosis}
    Medicines Prescribed: ${medicines || "None"}

    Return ONLY raw JSON, with no markdown formatting.
    Format:
    {
      "clinicalSummary": "...",
      "whatsappMessage": "..."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const cleanedText = text.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const parsed = JSON.parse(cleanedText);
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate summary. Make sure your API key is valid." }, { status: 500 });
  }
}
