import express from "express";
import fetch from "node-fetch";

const AIrouter = express.Router();

AIrouter.post("/generatePlaylist", async (req, res) => {
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
    // 1️⃣ Get genres/keywords from Gemini
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
      return res.status(500).json({ error: "Invalid JSON from Gemini", raw: text });
    }

    const { genres, keywords } = jsonResponse;

    if ((!genres || genres.length === 0) && (!keywords || keywords.length === 0)) {
      return res.status(400).json({ error: "No genres or keywords returned from Gemini" });
    }

    // -----------------------------
    // 2️⃣ Search Spotify tracks
    // -----------------------------
    const searchTerms = [...(genres || []), ...(keywords || [])].join(" ");
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerms)}&type=track&limit=10`,
      {
        headers: { Authorization: spotifyToken }
      }
    );

    if (!spotifyRes.ok) {
      const errText = await spotifyRes.text();
      console.error("Spotify API error:", errText);
      return res.status(spotifyRes.status).json({ error: "Spotify search failed", details: errText });
    }

    const spotifyData = await spotifyRes.json();
    const tracks = spotifyData.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      url: track.external_urls.spotify,
      preview_url: track.preview_url
    }));

    const trackUris = tracks.map(t => `spotify:track:${t.id}`);

    // -----------------------------
    // 3️⃣ Get current user profile
    // -----------------------------
    const userRes = await fetch(`https://api.spotify.com/v1/me`, {
      headers: { Authorization: spotifyToken }
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error("Spotify /me error:", errText);
      return res.status(userRes.status).json({ error: "Failed to get user profile", details: errText });
    }

    const userData = await userRes.json();
    const userId = userData.id;

    // -----------------------------
    // 4️⃣ Create a new playlist
    // -----------------------------
    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: spotifyToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `Moodify: ${mood}`,
        description: `A playlist generated for mood: ${mood}`,
        public: false
      })
    });

    if (!playlistRes.ok) {
      const errText = await playlistRes.text();
      console.error("Playlist creation error:", errText);
      return res.status(playlistRes.status).json({ error: "Failed to create playlist", details: errText });
    }

    const playlistData = await playlistRes.json();
    const playlistId = playlistData.id;

    // -----------------------------
    // 5️⃣ Add tracks to playlist
    // -----------------------------
    const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: spotifyToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uris: trackUris })
    });

    if (!addTracksRes.ok) {
      const errText = await addTracksRes.text();
      console.error("Add tracks error:", errText);
      return res.status(addTracksRes.status).json({ error: "Failed to add tracks", details: errText });
    }

    // -----------------------------
    // ✅ Response
    // -----------------------------
    res.json({
      ...jsonResponse,
      playlist: {
        id: playlistId,
        name: playlistData.name,
        url: playlistData.external_urls.spotify
      },
      tracks
    });

  } catch (error) {
    console.error("Error generating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default AIrouter;
