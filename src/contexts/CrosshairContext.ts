// Context for crosshair state
import { createContext } from "react";
import { Object3D } from "three";

type CrosshairContextType = {
  hoveredObject: Object3D | null;
  registerObject: (obj: Object3D, id: string) => void;
  unregisterObject: (id: string) => void;
};
export const CrosshairContext = createContext<CrosshairContextType | null>(
  null,
);
