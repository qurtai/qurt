import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import LoaderScreen from "@/components/LoaderScreen";
import { OnboardingPage } from "@/features/onboarding";
import { AppRoutes } from "./app/routes";

interface AlemContextType {
  settings: any;
  updateSettings: (settings: any) => Promise<void>;
}

export const AlemContext = createContext<AlemContextType>({
  settings: {},
  updateSettings: async () => {},
});

const LOADER_MIN_MS = 1500;

function App() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const started = Date.now();
    async function init() {
      const { bootstrapDb } = await import("./db/bootstrap");
      await bootstrapDb();
      if (window.alem) {
        const s = await window.alem.getSettings();
        setSettings(s);
        setShowOnboarding(!s?.hasSeenOnboarding);
      }
      const elapsed = Date.now() - started;
      const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
      setTimeout(() => setReady(true), remaining);
    }
    init();
  }, []);

  const updateSettings = async (newSettings: any) => {
    setSettings(newSettings);
    if (window.alem) {
      await window.alem.saveSettings(newSettings);
    }
  };

  const completeOnboarding = async (options?: { openSettings?: boolean }) => {
    const nextSettings = { ...settings, hasSeenOnboarding: true };
    await updateSettings(nextSettings);
    setShowOnboarding(false);

    if (options?.openSettings) {
      navigate("/settings");
    }
  };

  if (!ready) {
    return <LoaderScreen />;
  }

  return (
    <AlemContext.Provider value={{ settings, updateSettings }}>
      {showOnboarding ? (
        <OnboardingPage onComplete={completeOnboarding} />
      ) : (
        <AppRoutes />
      )}
    </AlemContext.Provider>
  );
}

export default App;
