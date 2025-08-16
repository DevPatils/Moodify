import { useState } from "react";

type Track = {
  id: string;
  name: string;
  artist: string;
  preview_url?: string;
};

type PlaylistData = {
  playlist: {
    url: string;
    name: string;
  };
  tracks: Track[];
};

export default function Moodify() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const token = localStorage.getItem("spotify_token");

    if (!token) {
      setError("No Spotify token found in localStorage. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const res = await fetch("http://localhost:5000/ai/generatePlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mood })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setPlaylist(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 text-black p-6">
      <h1 className="text-4xl font-bold mb-6 bg-black text-white px-4 py-2 rounded-xl border-4 border-black">
        🎵 Moodify
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your mood..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="px-4 py-2 border-4 border-black rounded-xl bg-white text-black w-80"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-pink-400 border-4 border-black rounded-xl font-bold shadow-lg hover:bg-pink-300 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="bg-red-300 border-4 border-black px-4 py-2 rounded-xl mb-4">
          ❌ {error}
        </div>
      )}

      {playlist && (
        <div className="bg-white border-4 border-black rounded-xl p-6 shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Playlist Created 🎉</h2>
          <a
            href={playlist.playlist.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {playlist.playlist.name}
          </a>

          <h3 className="mt-4 mb-2 font-bold">Tracks:</h3>
          <ul className="space-y-2">
            {playlist.tracks.map((track) => (
              <li
                key={track.id}
                className="border-2 border-black rounded-lg px-3 py-2 bg-yellow-200"
              >
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm">by {track.artist}</p>
                {track.preview_url && (
                  <audio controls className="mt-2 w-full">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
