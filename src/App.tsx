import { Routes, Route } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import UpdatesAndFaqPage from "@/pages/UpdatesAndFaqPage";
import PhotoEditingPage from "@/templates/PhotoEditingPage";
import VideoGenerationPage from "@/templates/VideoGenerationPage";
import EducationFeedbackPage from "@/templates/EducationFeedbackPage";
import CodeGenerationPage from "@/templates/CodeGenerationPage";
import AudioGenerationPage from "@/templates/AudioGenerationPage";

interface AlemContextType {
  settings: any;
  updateSettings: (settings: any) => Promise<void>;
}

export const AlemContext = createContext<AlemContextType>({
  settings: {},
  updateSettings: async () => {},
});

function App() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    async function init() {
      if (window.alem) {
        const s = await window.alem.getSettings();
        setSettings(s);
      }
    }
    init();
  }, []);

  const updateSettings = async (newSettings: any) => {
    setSettings(newSettings);
    if (window.alem) {
      await window.alem.saveSettings(newSettings);
    }
  };

  return (
    <AlemContext.Provider value={{ settings, updateSettings }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/photo-editing" element={<PhotoEditingPage />} />
        <Route path="/video-generation" element={<VideoGenerationPage />} />
        <Route
          path="/education-feedback"
          element={<EducationFeedbackPage />}
        />
        <Route path="/code-generation" element={<CodeGenerationPage />} />
        <Route path="/audio-generation" element={<AudioGenerationPage />} />
        <Route path="/updates-and-faq" element={<UpdatesAndFaqPage />} />
      </Routes>
    </AlemContext.Provider>
  );
}

export default App;
