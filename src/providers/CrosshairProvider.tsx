import * as React from "react";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D, Vector2 } from "three";
import { CrosshairContext as CrosshairContext1 } from "@/contexts/CrosshairContext.ts";

export function CrosshairProvider({ children }: { children: React.ReactNode }) {
  const { camera, raycaster } = useThree();
  const [hoveredObject, setHoveredObject] = useState<Object3D | null>(null);
  const registeredObjects = useRef<Map<string, Object3D>>(new Map());

  const registerObject = (obj: Object3D, id: string) => {
    registeredObjects.current.set(id, obj);
  };

  const unregisterObject = (id: string) => {
    registeredObjects.current.delete(id);
  };

  // Single raycasting system for all objects
  useFrame(() => {
    // Raycast from screen center
    raycaster.setFromCamera(new Vector2(0, 0), camera);

    // Get all registered objects
    const objects = Array.from(registeredObjects.current.values());
    const intersects = raycaster.intersectObjects(objects, false);

    // Set the closest object as hovered (or null if none)
    const closest = intersects.length > 0 ? intersects[0].object : null;

    if (closest !== hoveredObject) {
      setHoveredObject(closest);
    }
  });

  return (
    <CrosshairContext1
      value={{ hoveredObject, registerObject, unregisterObject }}
    >
      {children}
    </CrosshairContext1>
  );
}
