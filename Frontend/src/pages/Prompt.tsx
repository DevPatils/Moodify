import React from 'react';
import Sidebar from '../components/SideBar';
import MoodInput from '../components/MoodInput';
import Typewriter from '../components/Typewriter';

const PromptPage: React.FC = () => {
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('spotify_token');

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* Sidebar - fixed left (hidden on small screens) */}
      <div className="hidden md:block w-64 bg-[#0b0b0b] border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

  {/* Mobile sidebar controls removed */}

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

  {/* Mobile drawer removed */}
    </div>
  );
};

export default PromptPage;
