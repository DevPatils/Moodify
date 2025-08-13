import React, { useState } from 'react';

const MoodInput: React.FC = () => {
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call your backend/API to generate playlist
    console.log("Generating playlist for mood:", mood);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <form onSubmit={handleSubmit} className="flex items-center p-4 bg-gray-800 rounded-lg">
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling today? e.g., 'Feeling nostalgic about my college days...'"
          className="flex-1 p-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Generate
        </button>
      </form>
    </div>
  );
};

export default MoodInput;
