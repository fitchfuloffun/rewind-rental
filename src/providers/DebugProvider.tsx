import { createContext, useContext, useEffect, useState } from "react";

type DebugContextType = {
  debugMode: boolean;
  setDebugMode: (debugMode: boolean) => void;
};
// Debug Context
const DebugContext = createContext<DebugContextType | null>(null);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "b") {
        setDebugMode((prev) => !prev);
        console.log("Debug mode:", !debugMode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <DebugContext.Provider value={{ debugMode, setDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
}
