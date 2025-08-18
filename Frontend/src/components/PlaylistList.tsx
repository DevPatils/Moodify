import React, { useState } from "react";
import { usePlaylists } from "../context/PlayListContext";
import type { Track } from "../context/PlayListContext";

// Props: compact (default true) renders sidebar-style rows; expanded shows full cards + tracks
interface PlaylistListProps {
  compact?: boolean;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ compact = true }) => {
  const { playlists } = usePlaylists();
  const [openPlaylistId, setOpenPlaylistId] = useState<string | null>(null);

  if (!playlists || playlists.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">No playlists yet. Generate one above 🎶</div>
    );
  }

  // Compact sidebar row
  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {playlists.map((pl) => (
          <div key={pl.id} className="group border-b border-transparent hover:border-gray-800 py-1">
            <div
              onClick={() => setOpenPlaylistId(openPlaylistId === pl.id ? null : pl.id)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {/* thumbnail */}
              {pl.tracks && pl.tracks.length > 0 && pl.tracks[0].albumArt ? (
                <img src={pl.tracks[0].albumArt} alt={pl.name} className="w-10 h-10 rounded-md object-cover shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                  {pl.name ? pl.name.charAt(0).toUpperCase() : "P"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{pl.name || "Untitled"}</div>
                <div className="text-xs text-gray-400 truncate">{pl.tracks?.length ? `${pl.tracks.length} tracks` : "Playlist"}</div>
              </div>

              <a href={pl.url} target="_blank" rel="noreferrer" className="text-xs text-green-400 font-medium ml-2">
                Open
              </a>
            </div>

            {/* expanded tracks for this playlist when selected */}
            {openPlaylistId === pl.id && pl.tracks && pl.tracks.length > 0 && (
              <ul className="mt-2 ml-14 space-y-2">
                {pl.tracks.map((track: Track) => (
                  <li key={`${pl.id}-${track.id}`}>
                    <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition">
                      {track.albumArt ? (
                        <img src={track.albumArt} alt={track.name} className="w-8 h-8 rounded-md object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">🎵</div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{track.name}</div>
                        <div className="text-xs text-gray-400 truncate">{track.artists?.join(", ")}</div>
                      </div>

                      <div className="text-xs text-gray-400">▶</div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Expanded card view (default fallback similar to previous behaviour)
  return (
    <div className="space-y-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md">
          <a href={playlist.url} target="_blank" rel="noreferrer" className="text-lg font-bold text-green-400 hover:underline">
            {playlist.name || "Untitled Playlist"}
          </a>

          {playlist.tracks && playlist.tracks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {playlist.tracks.map((track: Track) => (
                <li key={`${playlist.id}-${track.id}`}>
                  <a href={track.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition cursor-pointer">
                    {track.albumArt ? (
                      <img src={track.albumArt} alt={`${track.name} album cover`} className="w-12 h-12 rounded-md object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">🎵</div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white truncate">{track.name || "Unknown Track"}</p>
                      <p className="text-xs text-gray-400 truncate">{track.artists?.length ? track.artists.join(", ") : "Unknown Artist"}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No tracks found for this playlist.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;
