import { useContext } from "react";
import { CrosshairContext } from "@/contexts/CrosshairContext.ts";

export function useCrosshair() {
  const context = useContext(CrosshairContext);
  if (!context) {
    throw new Error("useCrosshair must be used within CrosshairProvider");
  }
  return context;
}
