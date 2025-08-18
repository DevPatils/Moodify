import { useState, useEffect } from "react";
import { usePlaylists } from "../context/PlayListContext";

export default function Moodify() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPlaylist, setPopupPlaylist] = useState<{ id: string; name?: string; url?: string } | null>(null);
  const [copied, setCopied] = useState(false);
const base = import.meta.env.VITE_BASE_URL;
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
      const res = await fetch(`${base}/ai/generatePlaylist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const newPlaylist = {
        id: crypto.randomUUID(),
        name: data.playlist.name,
        url: data.playlist.url,
        tracks: data.tracks || [],
      };

      replacePlaylists([newPlaylist]);
      setMood("");

      // show popup with new playlist
      setPopupPlaylist(newPlaylist);
      setPopupOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!popupOpen) return;
    const t = setTimeout(() => setPopupOpen(false), 8000); // auto-dismiss
    return () => clearTimeout(t);
  }, [popupOpen]);

  return (
    <div className="w-full glass-card p-4 transform transition-all duration-500 ease-out animate-pop">
      <h2 className="text-lg font-bold mb-3 text-left">Type your prompt</h2>

      <div className="bg-[#06060a] rounded-lg p-4">
        <textarea
          placeholder="Describe your mood, vibe, or a few songs you like..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:outline-none min-h-[140px] resize-vertical"
          disabled={loading}
          rows={5}
        />

  <div className="mt-4 flex items-center justify-between gap-4">
          {error ? <div className="text-sm text-red-400">{error}</div> : <div className="text-sm text-gray-400">Provide as much detail as you want</div>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="ml-auto px-6 py-2 btn-accent font-semibold rounded-full hover:brightness-105 disabled:opacity-50 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
      {/* Popup modal */}
      {popupOpen && popupPlaylist && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 md:p-4 pb-6 md:pb-0">
          {/* overlay only on md+ */}
          <div className="hidden md:block absolute inset-0 bg-black/60" onClick={() => setPopupOpen(false)} />

          {/* card: bottom full-width on mobile, centered on desktop */}
          <div className="relative w-full md:w-96 max-w-full">
            <div className="glass-card p-4 md:p-5 w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm muted">Playlist created</div>
                  <div className="font-semibold truncate">{popupPlaylist.name}</div>
                  <a href={popupPlaylist.url} target="_blank" rel="noreferrer" className="text-xs muted block max-w-full md:max-w-xs break-words break-all whitespace-normal">{popupPlaylist.url}</a>
                </div>

                <div className="flex w-full md:w-auto flex-col md:flex-row gap-2 mt-3 md:mt-0">
                  <a href={popupPlaylist.url} target="_blank" rel="noreferrer" className="w-full md:w-auto px-3 py-2 btn-accent rounded-full text-sm text-center">Open</a>
                  <button aria-label={copied ? 'Copied' : 'Copy link'} title={copied ? 'Copied' : 'Copy link'} className="hidden md:inline-flex md:w-auto px-3 py-2 bg-gray-800 rounded-full text-sm items-center justify-center" onClick={async () => {
                    try {
                      await navigator.clipboard?.writeText(popupPlaylist.url || '');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      // ignore
                    }
                  }}>
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M8 6h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
