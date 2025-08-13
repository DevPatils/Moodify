// UserProfileFetcher.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "./UserProfile";
import type { UserProfileProps } from "./UserProfile";

interface SpotifyUser {
  display_name: string;
  images?: { url: string }[];
}

const UserProfileFetcher: React.FC = () => {
  const [name, setName] = useState<UserProfileProps["name"]>();
  const [image, setImage] = useState<UserProfileProps["image"]>();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) return;

    axios
      .get<SpotifyUser>("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.display_name);
        setImage(res.data.images?.[0]?.url);
      })
      .catch((err) => {
        console.error("Error fetching Spotify profile:", err);
        localStorage.removeItem("spotify_token");
      });
  }, []);

  return <UserProfile name={name} image={image} />;
};

export default UserProfileFetcher;
