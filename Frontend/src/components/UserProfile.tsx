import React from "react";
import LoginButton from "./LoginButton";

export interface UserProfileProps {
  name?: string;
  image?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, image }) => {
  const isLoggedIn = !!name;
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('spotify_token');

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('spotify_token');
    // optional: remove any other spotify-related keys
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <>
          <img
            src={image || "https://via.placeholder.com/40"}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-sm">
            <div className="font-bold flex items-center gap-2">
              {name}
              {hasToken && (
                <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 ml-2 px-2 py-1 rounded-md bg-transparent border border-transparent hover:bg-gray-800">Logout</button>
              )}
            </div>
            <div className="text-xs text-gray-400">Premium</div>
          </div>
        </>
      ) : (
<>
  <div className="container flex flex-col gap-4">
    {/* App Branding */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        M
      </div>
      <div className="text-sm">
        <div className="font-bold">Moodify</div>
        <div className="text-xs text-gray-400">Create playlists</div>
      </div>
    </div>

    {/* Login button BELOW branding */}
    <LoginButton />
  </div>
</>

      )}
    </div>
  );
};

export default UserProfile;
