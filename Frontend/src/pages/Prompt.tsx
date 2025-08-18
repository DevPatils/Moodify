import React, { useState } from 'react';
import Sidebar from '../components/SideBar';
import MoodInput from '../components/MoodInput';
import Typewriter from '../components/Typewriter';

const PromptPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('spotify_token');

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Sidebar - fixed left (hidden on small screens) */}
      <div className="hidden md:block w-64 bg-[#0b0b0b] border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          aria-label="Open sidebar"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md bg-gray-900/40 backdrop-blur-sm shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Right content - stacked vertically */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl md:max-w-4xl glass-card p-6 md:p-10 transform transition-all duration-700 ease-out animate-card-enter">

          <div className="flex flex-col gap-6 items-center text-center">

            {/* Heading with subtle gradient */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#7efc9a,#00e5a8,#00c853)' }}>
              <Typewriter text={'Hey, lets vibe 🎧'} speed={70} />
            </h1>

            {/* Description */}
            <p className="muted leading-relaxed max-w-3xl">
              Use AI to create Spotify playlists based on your mood. Generate playlists, discover new vibes, and manage your library.
            </p>

            {/* Mood input below */}
            {!isLoggedIn && (
              <div className="w-full max-w-3xl py-3 px-4 rounded-md bg-yellow-900/10 border border-yellow-800 text-yellow-100 mb-4 flex items-center justify-between">
                <div className="text-sm">Please log in with Spotify first from the sidebar to generate playlists.</div>
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline text-xs muted">Open the sidebar at left to sign in.</span>
                </div>
              </div>
            )}

            <MoodInput />

          </div>

        </div>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 sm:w-80 bg-[#0f1114] p-4">
            <div className="flex justify-end">
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-md bg-gray-800/40">✕</button>
            </div>
            <Sidebar className="w-72 sm:w-80" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPage;
