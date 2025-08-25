import { useEffect, useState } from "react";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor.tsx";
import { DebugContext, PerformanceStats } from "@/contexts/DebugContext.ts";

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugMode] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 0,
    renderCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    programs: 0,
    meshCount: 0,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "b") {
        setDebugMode((prev) => {
          const newMode = !prev;
          console.log("Debug mode:", newMode);
          return newMode;
        });
      }
      if (event.key.toLowerCase() === "p") {
        setShowPerformance((prev) => {
          const newShow = !prev;
          console.log("Show performance:", newShow);
          return newShow;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <DebugContext.Provider
      value={{
        debugMode,
        setDebugMode,
        showPerformance,
        setShowPerformance,
        performanceStats,
        setPerformanceStats,
      }}
    >
      {children}

      {/* Performance Monitor UI */}
      {showPerformance && (
        <PerformanceMonitor performanceStats={performanceStats} />
      )}
    </DebugContext.Provider>
  );
}
