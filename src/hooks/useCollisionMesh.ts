import { RefObject, useCallback, useEffect, useRef } from "react";
import { Box3, Object3D } from "three";
import { useCollision } from "@/hooks/useCollision.ts";

export function useCollisionMesh(
  meshRef: RefObject<Object3D | null>,
  id: string,
) {
  const { addBoundingBox, removeBoundingBox, updateBoundingBox } =
    useCollision();
  const boundingBoxRef = useRef<Box3 | null>(null);

  useEffect(() => {
    if (meshRef.current && id) {
      const boundingBox = new Box3().setFromObject(meshRef.current);
      boundingBoxRef.current = boundingBox;
      addBoundingBox(id, boundingBox);

      return () => {
        removeBoundingBox(id);
      };
    }
  }, [id, addBoundingBox, removeBoundingBox, meshRef]);

  const addCollisionBox = useCallback(
    (meshRef: RefObject<Object3D | null>, id: string) => {
      if (meshRef.current && id) {
        const boundingBox = new Box3().setFromObject(meshRef.current);
        boundingBoxRef.current = boundingBox;
        addBoundingBox(id, boundingBox);

        return () => {
          removeBoundingBox(id);
        };
      }
    },
    [addBoundingBox, removeBoundingBox],
  );

  const updateCollisionBox = useCallback(() => {
    if (meshRef.current && id && boundingBoxRef.current) {
      boundingBoxRef.current.setFromObject(meshRef.current);
      updateBoundingBox(id, boundingBoxRef.current);
    }
  }, [id, updateBoundingBox, meshRef]);

  const removeCollisionBox = useCallback(() => {
    removeBoundingBox(id);
  }, [id, removeBoundingBox]);

  return { addCollisionBox, updateCollisionBox, removeCollisionBox };
}
