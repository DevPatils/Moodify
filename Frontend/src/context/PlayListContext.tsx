import React, { createContext, useContext, useState } from "react";

// Track model
export type Track = {
  id: string;
  name: string;
  artists: string[];
  previewUrl?: string;
  spotifyUrl: string;
  albumArt?: string; // optional for UI thumbnails
  url: string;
};

// Playlist model
export type Playlist = {
  id: string;
  name: string;
  url: string;
  tracks: Track[];
};

interface PlaylistContextType {
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
  clearPlaylists: () => void;
  getPlaylist: (id: string) => Playlist | undefined;
  replacePlaylists: (newPlaylists: Playlist[]) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists((prev) => [...prev, { ...playlist }]); // clone to force re-render
  };

  const clearPlaylists = () => {
    setPlaylists([]);
  };

  const getPlaylist = (id: string) => {
    return playlists.find((pl) => pl.id === id);
  };

  const replacePlaylists = (newPlaylists: Playlist[]) => {
    // clone newPlaylists to avoid reference issues
    setPlaylists(newPlaylists.map((pl) => ({ ...pl })));
  };

  return (
    <PlaylistContext.Provider
      value={{ playlists, addPlaylist, clearPlaylists, getPlaylist, replacePlaylists }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error("usePlaylists must be used inside PlaylistProvider");
  return context;
};
