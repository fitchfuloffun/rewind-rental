import { createContext } from "react";
import { Box3 } from "three";

type CollisionContextType = {
  addBoundingBox: (id: string, box: Box3) => void;
  removeBoundingBox: (id: string) => void;
  updateBoundingBox: (id: string, box: Box3) => void;
  checkCollisions: (testBox: Box3) => { id: string; box: Box3 }[];
  getAllBoundingBoxes: () => void;
  boundingBoxes: Map<string, Box3>;
};

export const CollisionContext = createContext<CollisionContextType | null>(
  null,
);
