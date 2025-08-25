import { createContext } from "react";

export type PerformanceStats = {
  fps: number;
  renderCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  meshCount: number;
};

type DebugContextType = {
  debugMode: boolean;
  setDebugMode: (debugMode: boolean) => void;
  showPerformance: boolean;
  setShowPerformance: (showPerformance: boolean) => void;
  performanceStats: PerformanceStats;
  setPerformanceStats: (stats: PerformanceStats) => void;
};
export const DebugContext = createContext<DebugContextType | null>(null);
