import { useState } from "react";
import { usePlaylists } from "../context/PlayListContext";

export default function Moodify() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { replacePlaylists } = usePlaylists();

  const handleGenerate = async () => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      setError("No Spotify token found in localStorage. Please log in.");
      return;
    }

    if (!mood.trim()) {
      setError("Please enter a mood first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/ai/generatePlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // ✅ Replace global playlists with the new one
      replacePlaylists([
        {
          id: crypto.randomUUID(),
          name: data.playlist.name,
          url: data.playlist.url,
          tracks: data.tracks || [],
        },
      ]);

      // clear mood input
      setMood("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Generate a Playlist 🎶</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter your mood..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="px-4 py-2 rounded-lg flex-1 bg-gray-900 border border-gray-700 text-white"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-green-500 rounded-lg font-bold hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error && (
        <div className="bg-red-500 px-4 py-2 rounded text-white">{error}</div>
      )}
    </div>
  );
}
