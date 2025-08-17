import React from "react";

import PromptPage from "./pages/Prompt";
import { PlaylistProvider } from "./context/PlayListContext";
const App: React.FC = () => {
 

  return (
    <PlaylistProvider>
    <div className="flex flex-col items-center justify-center h-screen bg-ebonyclay text-white">
      <PromptPage/>
    </div>
    </PlaylistProvider>
  );
};

export default App;
