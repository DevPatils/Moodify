import express from "express";
import fetch from "node-fetch";

const AIrouter = express.Router();

// POST /ai/generateKeywords
AIrouter.post("/generateKeywords", async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  try {
    const prompt = `
      Given the following mood description:
      "${mood}"

      Return ONLY valid JSON with the following keys:
      - genres: array of strings
      - keywords: array of strings
      - energy: one of "low", "medium", "high"

      Do not include any markdown, code fences, or additional commentary.
    `;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiRes.json();

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Remove markdown code fences if Gemini includes them
    text = text.replace(/```json\s*|\s*```/g, "").trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", parseErr, "Raw text:", text);
      return res.status(500).json({
        error: "Invalid JSON returned from Gemini",
        raw: text
      });
    }

    res.json(jsonResponse);
  } catch (error) {
    console.error("Error generating keywords from mood:", error);
    res.status(500).json({ error: "Failed to process mood" });
  }
});

export default AIrouter;
