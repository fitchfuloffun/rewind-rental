import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { STORE_DIMENSIONS } from "../constants";

// Combined keyboard and mouse controls
export function FirstPersonControls({ disabled = false }) {
  const { camera, gl } = useThree();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const rotation = useRef({ x: 0, y: 0 });
  const isPointerLocked = useRef(false);

  useEffect(() => {
    // Release pointer lock when disabled
    if (disabled && document.pointerLockElement) {
      document.exitPointerLock();
    } else if (!disabled && !document.pointerLockElement) {
      // Re-lock when menu closes (optional - or let user click to re-engage)
      gl.domElement.requestPointerLock();
    }
  }, [disabled, gl.domElement]);

  useEffect(() => {
    if (disabled) return; // Don't add listeners if disabled

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.code] = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked.current) return;

      const sensitivity = 0.002;
      const deltaX = event.movementX * sensitivity;
      const deltaY = event.movementY * sensitivity;

      rotation.current.y -= deltaX;
      rotation.current.x -= deltaY;

      // Limit vertical rotation
      rotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.x),
      );
    };

    const handleClick = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;

      // If controls are disabled and pointer gets locked somehow, unlock it
      if (disabled && document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    gl.domElement.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl.domElement, disabled]);

  useFrame((_state, delta) => {
    if (disabled) return; // Don't process movement if disabled

    const isRunning = keysPressed.current["ShiftLeft"];
    const baseSpeed = 6; // Increased base speed
    const speed = (isRunning ? baseSpeed * 2 : baseSpeed) * delta;
    const walkingHeight = 3; // Fixed walking height

    // Apply mouse rotation
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;

    // Lock camera to walking height
    camera.position.y = walkingHeight;

    // Calculate movement vector
    const moveVector = new Vector3();

    if (keysPressed.current["KeyW"]) moveVector.z -= 1;
    if (keysPressed.current["KeyS"]) moveVector.z += 1;
    if (keysPressed.current["KeyA"]) moveVector.x -= 1;
    if (keysPressed.current["KeyD"]) moveVector.x += 1;

    // If there's movement, normalize and apply
    if (moveVector.length() > 0) {
      moveVector.normalize();

      // Apply camera rotation to movement vector
      moveVector.applyQuaternion(camera.quaternion);

      // Keep movement horizontal
      moveVector.y = 0;
      moveVector.normalize();

      // Scale by speed
      moveVector.multiplyScalar(speed);

      // Test X movement separately for wall sliding
      const currentPos = camera.position.clone();
      const testXPos = currentPos.clone();
      testXPos.x += moveVector.x;
      testXPos.y = walkingHeight;

      if (isInsideStore(testXPos)) {
        camera.position.x = testXPos.x;
      }

      // Test Z movement separately for wall sliding
      const testZPos = camera.position.clone();
      testZPos.z += moveVector.z;
      testZPos.y = walkingHeight;

      if (isInsideStore(testZPos)) {
        camera.position.z = testZPos.z;
      }
    }
  });

  // Collision detection - keep player inside store boundaries
  const isInsideStore = (position: Vector3) => {
    const margin = 0.5;

    return (
      position.x > -STORE_DIMENSIONS.HALF_WIDTH + margin &&
      position.x < STORE_DIMENSIONS.HALF_WIDTH - margin &&
      position.z > -STORE_DIMENSIONS.HALF_DEPTH + margin &&
      position.z < STORE_DIMENSIONS.HALF_DEPTH - margin
    );
  };

  return null;
}
