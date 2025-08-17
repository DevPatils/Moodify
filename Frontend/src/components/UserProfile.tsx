import React from "react";
import LoginButton  from "../components/LoginButton";

export interface UserProfileProps {
  name?: string;
  image?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, image }) => {
  const isLoggedIn = !!name;

  return (
    <div className="container flex justify-center items-center bg-ebonyclay text-white flex-col p-4 rounded-xl">
      {isLoggedIn ? (
        <>
          <div className="flex items-center mb-2 mt-2 rounded-lg">
            <img
              src={image || "https://via.placeholder.com/40"}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
          </div>
          <div className="font-bold">Moodify</div>
          <div className="font-bold">{name}</div>
        </>
      ) : (
        <>
          <div className="font-bold mb-2">Moodify</div>
          <LoginButton />
        </>
      )}
    </div>
  );
};

export default UserProfile;
