import { useCallback, useState } from "react";
import { Box3 } from "three";
import { CollisionContext } from "@/contexts/CollisionContext.ts";
import { CollisionDebugRenderer } from "@/debug/CollisionDebugRenderer.tsx";
import { useDebug } from "@/hooks/useDebug.ts";

export function CollisionProvider({ children }: { children: React.ReactNode }) {
  const { debugMode } = useDebug();

  const [boundingBoxes, setBoundingBoxes] = useState<Map<string, Box3>>(
    new Map(),
  );

  const addBoundingBox = useCallback((id: string, box: Box3) => {
    setBoundingBoxes((prev) => new Map(prev).set(id, box));
  }, []);

  const removeBoundingBox = useCallback((id: string) => {
    setBoundingBoxes((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const updateBoundingBox = useCallback((id: string, box: Box3) => {
    setBoundingBoxes((prev) => {
      if (prev.has(id)) {
        return new Map(prev).set(id, box);
      }
      return prev;
    });
  }, []);

  const checkCollisions = useCallback(
    (testBox: Box3) => {
      const collisions = [];
      for (const [id, box] of boundingBoxes) {
        if (testBox.intersectsBox(box)) {
          collisions.push({ id, box });
        }
      }
      return collisions;
    },
    [boundingBoxes],
  );

  const getAllBoundingBoxes = useCallback(() => {
    return Array.from(boundingBoxes.values());
  }, [boundingBoxes]);

  return (
    <CollisionContext.Provider
      value={{
        addBoundingBox,
        removeBoundingBox,
        updateBoundingBox,
        checkCollisions,
        getAllBoundingBoxes,
        boundingBoxes,
      }}
    >
      {children}
      {debugMode && <CollisionDebugRenderer />}
    </CollisionContext.Provider>
  );
}
