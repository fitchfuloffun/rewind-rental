import { createContext } from "react";

type DebugContextType = {
  debugMode: boolean;
  setDebugMode: (debugMode: boolean) => void;
};
export const DebugContext = createContext<DebugContextType | null>(null);
