import React from 'react';
import UserProfile from './UserProfile';
import PlaylistList from './PlaylistList';

const Sidebar: React.FC = () =>
  <div className="w-64 p-4 bg-gray-900 border-r border-gray-700">
    <UserProfile />
    <PlaylistList />
  </div>;

export default Sidebar;
