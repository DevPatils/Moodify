import React from "react";
import { usePlaylists } from "../context/PlayListContext";

const PlaylistList: React.FC = () => {
  const { playlists } = usePlaylists();

  if (!playlists || playlists.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        No playlists yet. Generate one above 🎶
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {playlists.map((playlist) => (
        <div
          key={playlist.id} // must be unique across playlists
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md"
        >
          {/* Playlist Header */}
          <a
            href={playlist.url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-green-400 hover:underline"
          >
            {playlist.name || "Untitled Playlist"}
          </a>

          {/* Track List */}
          {playlist.tracks && playlist.tracks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {playlist.tracks.map((track) => (
                <li key={`${playlist.id}-${track.id}`}>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition cursor-pointer"
                  >
                    {/* Album Art Thumbnail */}
                    {track.albumArt ? (
                      <img
                        src={track.albumArt}
                        alt={`${track.name} album cover`}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">
                        🎵
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {track.name || "Unknown Track"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {track.artists?.length
                          ? track.artists.join(", ")
                          : "Unknown Artist"}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No tracks found for this playlist.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;
