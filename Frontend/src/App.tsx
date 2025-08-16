import React, { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import PromptPage from "./pages/Prompt";
import { PlaylistProvider } from "./context/PlayListContext";
const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const _token = params.get("access_token");
      if (_token) {
        localStorage.setItem("spotify_token", _token);
        setToken(_token);
        window.location.hash = ""; // clean up the URL
      }
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  return (
    <PlaylistProvider>
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {!token ? (
        <LoginButton />
      ) : (
        <p className="text-xl">✅ Logged in with Spotify!</p>
      )}
      <PromptPage/>
    </div>
    </PlaylistProvider>
  );
};

export default App;
