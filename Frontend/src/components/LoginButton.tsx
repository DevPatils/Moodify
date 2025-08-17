import React from "react";
import { useEffect, useState } from "react";
const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login"; // backend auth route
  };
  const [token, setToken] = useState<string | null>(null);
  console.log(token);
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
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all"
    >
      Login with Spotify
    </button>
  );
};

export default LoginButton;
