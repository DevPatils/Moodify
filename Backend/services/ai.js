import express from "express";
import fetch from "node-fetch";

const AIrouter = express.Router();

// POST /ai/generateKeywords
AIrouter.post("/generateKeywords", async (req, res) => {
  const { mood } = req.body;
  const spotifyToken = req.headers["authorization"]; // Expecting: "Bearer <token>"

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  if (!spotifyToken) {
    return res.status(401).json({ error: "Spotify access token is required in Authorization header" });
  }

  try {
    // -----------------------------
    // 1️⃣ Send prompt to Gemini
    // -----------------------------
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

    const { genres } = jsonResponse;

    if (!genres || genres.length === 0) {
      return res.status(400).json({ error: "No genres returned from Gemini" });
    }

    // -----------------------------
    // 2️⃣ Query Spotify for tracks
    // -----------------------------
    const spotifyQuery = genres.join(" ");
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(spotifyQuery)}&type=track&limit=10`,
      {
        headers: {
          Authorization: spotifyToken // Directly pass the token from request header
        }
      }
    );

    if (!spotifyRes.ok) {
      const errText = await spotifyRes.text();
      console.error("Spotify API error:", errText);
      return res.status(spotifyRes.status).json({ error: "Spotify search failed", details: errText });
    }

    const spotifyData = await spotifyRes.json();
    const trackIds = spotifyData.tracks.items.map(track => track.id);

    // -----------------------------
    // 3️⃣ Send combined response
    // -----------------------------
    res.json({
      ...jsonResponse, // genres, keywords, energy
      trackIds
    });

  } catch (error) {
    console.error("Error generating keywords or fetching Spotify data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default AIrouter;
