import React, { createContext, useContext, useState } from "react";

// Track model
export type Track = {
  id: string;
  name: string;
  artists: string[];
  previewUrl?: string;
  spotifyUrl: string;
  albumArt?: string; // optional for UI thumbnails
  url : string;
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
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists((prev) => [...prev, playlist]);
  };

  const clearPlaylists = () => {
    setPlaylists([]);
  };

  const getPlaylist = (id: string) => {
    return playlists.find((pl) => pl.id === id);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, addPlaylist, clearPlaylists, getPlaylist }}>
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

