import React, { useState } from "react";
import axios from "axios";

const MoodInput: React.FC = () => {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  type ResultType = {
    keywords?: string[];
    [key: string]: unknown;
  };
  const [result, setResult] = useState<ResultType | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/ai/generateKeywords", { mood });
      setResult(res.data);
    } catch (error) {
      console.error("Error generating keywords:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 bg-gray-800 rounded-lg"
      >
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling today? e.g., 'Feeling nostalgic about my college days...'"
          className="flex-1 p-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg text-white">
          <h2 className="text-lg font-bold mb-2">AI Mood Analysis</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MoodInput;
