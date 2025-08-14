// UserProfile.tsx
import React from "react";

export interface UserProfileProps {
  name?: string;
  image?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name = "Please log in",
  image,
}) => (
  <div className="flex items-center p-4 mb-6 bg-gray-800 rounded-lg">
    <img
      src={image || "https://via.placeholder.com/40"}
      alt="User"
      className="w-10 h-10 rounded-full mr-3"
    />
    <span className="font-bold">{name}</span>
  </div>
);

export default UserProfile;
