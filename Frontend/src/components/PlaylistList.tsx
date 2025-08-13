import React from 'react';

interface Playlist {
  id: string;
  name: string;
}

interface PlaylistListProps {
  playlists?: Playlist[];
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists = [] }) => {
  if (playlists.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        Work in Progress
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {playlists.map(playlist => (
        <div
          key={playlist.id}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          {playlist.name}
        </div>
      ))}
    </div>
  );
};

export default PlaylistList;
