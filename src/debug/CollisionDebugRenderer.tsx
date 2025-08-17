import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Box3Helper } from "three";
import { useCollision } from "@/providers/CollisionProvider.tsx";
import { useDebug } from "@/providers/DebugProvider.tsx";

export function CollisionDebugRenderer({
  defaultColor = 0xff0000,
  collisionColor = 0x0000ff,
  playerBox = null,
}) {
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
  }, [debugMode, boundingBoxes, scene, playerBox, checkCollisions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting - cleaning up all helpers");
      const helpers = helpersRef.current;
      for (const [, helper] of helpers) {
        scene.remove(helper);
        if (helper.dispose) helper.dispose();
      }
      helpers.clear();
    };
  }, [scene]);

  return null;
}
