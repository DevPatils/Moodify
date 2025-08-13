import React from "react";

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login"; // backend auth route
  };

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
