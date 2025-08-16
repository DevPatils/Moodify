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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood }),
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
    <div className="flex h-screen bg-black text-white items-center justify-center">
      {/* Main Content */}
      <div className="p-10 flex flex-col items-center justify-center w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Generate a Playlist 🎶</h1>

        <div className="flex gap-2 mb-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter your mood..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="px-4 py-2 rounded-lg flex-1 bg-gray-900 border border-gray-700 text-white focus:outline-none"
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
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            ❌ {error}
          </div>
        )}

        {playlist && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-2">Playlist Created 🎉</h2>
            <a
              href={playlist.playlist.url}
              target="_blank"
              rel="noreferrer"
              className="text-green-400 underline"
            >
              {playlist.playlist.name}
            </a>

            <h3 className="mt-4 mb-2 font-bold">Tracks:</h3>
            <ul className="space-y-2">
              {playlist.tracks.map((track) => (
                <li
                  key={track.id}
                  className="border border-gray-700 rounded px-3 py-2 bg-gray-800"
                >
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-gray-400">by {track.artist}</p>
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
    </div>
  );
}
