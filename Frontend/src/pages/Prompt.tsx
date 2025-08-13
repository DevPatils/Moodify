import React from 'react';
import Sidebar from '../components/SideBar';
import MoodInput from '../components/MoodInput';

const PromptPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <MoodInput />
      </div>
    </div>
  );
};

export default PromptPage;
