import { useContext } from "react";
import { DebugContext } from "@/contexts/DebugContext.ts";

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
}
