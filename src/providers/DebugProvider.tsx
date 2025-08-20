import { useEffect, useState } from "react";
import { DebugContext as DebugContext1 } from "@/contexts/DebugContext.ts";

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
  }, [debugMode]);

  return (
    <DebugContext1 value={{ debugMode, setDebugMode }}>
      {children}
    </DebugContext1>
  );
}
