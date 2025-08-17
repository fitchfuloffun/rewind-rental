import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Box3 } from "three";
import { CollisionDebugRenderer } from "@/debug/CollisionDebugRenderer.tsx";
import { useDebug } from "@/providers/DebugProvider.tsx";

type CollisionContextType = {
  addBoundingBox: (id: string, box: Box3) => void;
  removeBoundingBox: (id: string) => void;
  updateBoundingBox: (id: string, box: Box3) => void;
  checkCollisions: (testBox: Box3) => { id: any; box: any }[];
  getAllBoundingBoxes: () => void;
  boundingBoxes: Map<string, Box3>;
};

const CollisionContext = createContext<CollisionContextType | null>(null);

export function CollisionProvider({ children }: { children: React.ReactNode }) {
  const { debugMode } = useDebug();

  useEffect(() => {
    console.log("CollisionProvider", debugMode);
  }, [debugMode]);
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

export function useCollision() {
  const context = useContext(CollisionContext);

  if (!context) {
    throw new Error("useCollision must be used within a CollisionProvider");
  }
  return context;
}
