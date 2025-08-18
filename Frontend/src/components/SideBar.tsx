import React from 'react';
import PlaylistList from './PlaylistList';
import UserProfileFetcher from './UserProfileFetcher';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => (
  <div className={`h-full w-64 p-6 bg-[#0f1114] flex flex-col gap-6 ${className}`}>
  {/* Top area intentionally left blank (logo removed) */}

    {/* User Profile (fetcher handles login state) */}
    <UserProfileFetcher />

    {/* Playlists list - fills remaining space */}
    <div className="flex-1 overflow-y-auto pt-2 scrollbar-themed">
      <PlaylistList />
    </div>
  </div>
);

export default Sidebar;
