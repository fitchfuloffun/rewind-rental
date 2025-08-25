// CrosshairContext.ts - Updated to support instanced meshes
import { createContext } from "react";
import { Object3D } from "three";

type HoveredTarget = {
  object: Object3D;
  instanceId?: number; // For instanced meshes
};

type CrosshairContextType = {
  hoveredObject: Object3D | null;
  hoveredInstanceId: number | null;
  hoveredTarget: HoveredTarget | null;
  registerObject: (obj: Object3D, id: string) => void;
  unregisterObject: (id: string) => void;
};

export const CrosshairContext = createContext<CrosshairContextType | null>(
  null,
);
