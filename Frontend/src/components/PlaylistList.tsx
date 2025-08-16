import React from "react";
import { usePlaylists } from "../context/PlayListContext";

const PlaylistList: React.FC = () => {
  const { playlists } = usePlaylists();

  if (playlists.length === 0) {
    return <div className="p-4 text-center text-gray-400">Work in Progress</div>;
  }

  return (
    <div className="space-y-6">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-md"
        >
          {/* Playlist Header */}
          <a
            href={playlist.url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-green-400 hover:underline"
          >
            {playlist.name}
          </a>

          {/* Track List */}
          <ul className="mt-3 space-y-2">
            {playlist.tracks.map((track) => (
              <li key={track.id}>
                <a
                
                  href={track.url} // Spotify track link
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium">{track.name}</p>
                    <p className="text-xs text-gray-400">
                      {track.artists?.join(", ")}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;
