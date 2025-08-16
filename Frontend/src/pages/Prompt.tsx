import React from 'react';
import Sidebar from '../components/SideBar';
import MoodInput from '../components/MoodInput';

const PromptPage: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Sidebar - fixed left */}
      <div className="w-64 bg-[#111] border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content - takes 100% of remaining space */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Heading + description */}
        <div className="p-6 text-center border-b border-gray-800">
          <h1 className="text-2xl font-bold">Allow ut your mantiful</h1>
          <p className="text-gray-400 text-sm">
            Use AI to create Spotify playlists based on your mood.  
            Generate playlists, discover new vibes, and manage your library. 
          </p>
        </div>

        {/* Mood input — fills the rest */}
        <div className="flex-1 bg-[#0d0d0d] w-full h-full">
          <MoodInput />
        </div>
      </div>
    </div>
  );
};

export default PromptPage;
