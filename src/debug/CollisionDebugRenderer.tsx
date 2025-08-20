import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Box3, Box3Helper } from "three";
import { useCollision } from "@/hooks/useCollision.ts";
import { useDebug } from "@/hooks/useDebug.ts";

type CollisionDebugRendererProps = {
  defaultColor?: number; // Default color for non-colliding boxes
  collisionColor?: number; // Color for colliding boxes
  playerBox?: Box3 | null;
};
export function CollisionDebugRenderer({
  defaultColor = 0xff0000,
  collisionColor = 0x0000ff,
  playerBox = null,
}: CollisionDebugRendererProps) {
  const { debugMode } = useDebug();
  const { boundingBoxes, checkCollisions } = useCollision();
  const { scene } = useThree();
  const helpersRef = useRef(new Map());

  useEffect(() => {
    if (!debugMode) {
      // Clean up all helpers when debug is off
      const helpers = helpersRef.current;
      for (const [, helper] of helpers) {
        scene.remove(helper);
        helper.dispose();
      }
      helpers.clear();
      return;
    }
    console.log("Debug mode ON, rendering", boundingBoxes.size, "boxes");
    const helpers = helpersRef.current;

    // // Get colliding boxes if player box is provided
    const collidingIds = new Set();
    if (playerBox) {
      const collisions = checkCollisions(playerBox);
      collisions.forEach(({ id }) => collidingIds.add(id));
    }

    // Remove helpers that no longer exist
    for (const [id, helper] of helpers) {
      if (!boundingBoxes.has(id)) {
        scene.remove(helper);
        helper.dispose();
        helpers.delete(id);
      }
    }

    // Add/update helpers for current bounding boxes
    for (const [id, box] of boundingBoxes) {
      let helper = helpers.get(id);
      const isColliding = collidingIds.has(id);
      const color = isColliding ? collisionColor : defaultColor;

      if (!helper) {
        // Create new helper
        helper = new Box3Helper(box, color);
        scene.add(helper);
        helpers.set(id, helper);
      } else {
        // Update existing helper
        helper.box = box;
        helper.material.color.setHex(color);
        helper.updateMatrixWorld();
      }
    }
  }, [
    debugMode,
    boundingBoxes,
    scene,
    playerBox,
    checkCollisions,
    collisionColor,
    defaultColor,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    // Capture the ref value when the effect runs
    const helperMap = helpersRef.current;

    return () => {
      console.log("Component unmounting - cleaning up all helpers");
      // Use the captured value instead of accessing .current in cleanup
      for (const [, helper] of helperMap) {
        scene.remove(helper);
        if (helper.dispose) helper.dispose();
      }
      helperMap.clear();
    };
  }, [scene]);

  return null;
}
