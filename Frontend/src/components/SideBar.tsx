import React from 'react';
import PlaylistList from './PlaylistList';
import UserProfileFetcher from './UserProfileFetcher';

const Sidebar: React.FC = () => (
  <div className="h-full w-64 p-6 bg-ebonyclay border-r border-gray-800 flex flex-col gap-8">
    {/* User Profile */}
    <UserProfileFetcher />

    {/* Playlists */}
    <div className="flex-1 overflow-y-auto">
      <PlaylistList />
    </div>
  </div>
);

export default Sidebar;
