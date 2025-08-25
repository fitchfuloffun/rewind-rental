// CrosshairProvider.tsx - Updated to handle instanced meshes
import * as React from "react";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { InstancedMesh, Object3D, Vector2 } from "three";
import { CrosshairContext } from "@/contexts/CrosshairContext.ts";

type HoveredTarget = {
  object: Object3D;
  instanceId?: number;
};

export function CrosshairProvider({ children }: { children: React.ReactNode }) {
  const { camera, raycaster } = useThree();
  const [hoveredTarget, setHoveredTarget] = useState<HoveredTarget | null>(
    null,
  );
  const registeredObjects = useRef<Map<string, Object3D>>(new Map());

  const registerObject = (obj: Object3D, id: string) => {
    registeredObjects.current.set(id, obj);
  };

  const unregisterObject = (id: string) => {
    registeredObjects.current.delete(id);
  };

  // Enhanced raycasting system that handles instanced meshes
  useFrame(() => {
    // Raycast from screen center
    raycaster.setFromCamera(new Vector2(0, 0), camera);

    // Get all registered objects
    const objects = Array.from(registeredObjects.current.values());
    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
      const intersection = intersects[0];
      const object = intersection.object;

      // Check if this is an instanced mesh
      if (
        object instanceof InstancedMesh &&
        intersection.instanceId !== undefined
      ) {
        const newTarget = {
          object,
          instanceId: intersection.instanceId,
        };

        // Only update if the target changed
        if (
          !hoveredTarget ||
          hoveredTarget.object !== object ||
          hoveredTarget.instanceId !== intersection.instanceId
        ) {
          setHoveredTarget(newTarget);
        }
      } else {
        // Regular mesh
        const newTarget = { object };

        if (
          !hoveredTarget ||
          hoveredTarget.object !== object ||
          hoveredTarget.instanceId !== undefined
        ) {
          setHoveredTarget(newTarget);
        }
      }
    } else {
      // No intersection
      if (hoveredTarget !== null) {
        setHoveredTarget(null);
      }
    }
  });

  // Provide both legacy and new APIs for backward compatibility
  const contextValue = {
    // Legacy API - for backward compatibility with existing Video components
    hoveredObject: hoveredTarget?.object || null,

    // New API - for instanced meshes
    hoveredInstanceId: hoveredTarget?.instanceId || null,
    hoveredTarget,

    registerObject,
    unregisterObject,
  };

  return (
    <CrosshairContext.Provider value={contextValue}>
      {children}
    </CrosshairContext.Provider>
  );
}
