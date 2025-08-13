import React from 'react';
import PlaylistList from './PlaylistList';
import UserProfileFetcher from './UserProfileFetcher';

const Sidebar: React.FC = () =>
  <div className="w-64 p-4 bg-gray-900 border-r border-gray-700">
    <UserProfileFetcher/>
    <PlaylistList />
  </div>;

export default Sidebar;
