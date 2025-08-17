import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Box3Helper } from "three";
import { useCollision } from "@/providers/CollisionProvider.tsx";

export function CollisionDebugRenderer({
  defaultColor = 0xff0000,
  collisionColor = 0xffff00,
  playerBox = null,
}) {
  const { boundingBoxes, checkCollisions } = useCollision();
  const { scene } = useThree();
  const helpersRef = useRef(new Map());

  useEffect(() => {
    const helpers = helpersRef.current;

    // Get colliding boxes if player box is provided
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
    boundingBoxes,
    scene,
    defaultColor,
    collisionColor,
    playerBox,
    checkCollisions,
  ]);

  return null;
}
