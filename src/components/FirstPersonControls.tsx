import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STORE_DIMENSIONS } from '../constants';

// Combined keyboard and mouse controls
export function FirstPersonControls() {
  const { camera, gl } = useThree();
  const keysPressed = useRef({});
  const mouseMove = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const isPointerLocked = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current[event.code] = true;
    };

    const handleKeyUp = (event) => {
      keysPressed.current[event.code] = false;
    };

    const handleMouseMove = (event) => {
      if (!isPointerLocked.current) return;
      
      const sensitivity = 0.002;
      mouseMove.current.x = event.movementX * sensitivity;
      mouseMove.current.y = event.movementY * sensitivity;
      
      rotation.current.y -= mouseMove.current.x;
      rotation.current.x -= mouseMove.current.y;
      
      // Limit vertical rotation
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
    };

    const handleClick = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gl]);

  useFrame(() => {
    const speed = 0.1;
    const walkingHeight = 2; // Fixed walking height
    
    // Apply mouse rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;
    
    // Lock camera to walking height
    camera.position.y = walkingHeight;
    
    // Calculate forward/right vectors (horizontal movement only)
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    
    forward.applyQuaternion(camera.quaternion);
    right.applyQuaternion(camera.quaternion);
    
    // Remove Y component to keep movement horizontal only
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();
    
    // Movement with collision detection
    const currentPos = camera.position.clone();
    
    if (keysPressed.current['KeyW']) {
      const newPos = currentPos.clone().add(forward.multiplyScalar(speed));
      newPos.y = walkingHeight;
      if (isInsideStore(newPos)) {
        camera.position.copy(newPos);
      }
    }
    
    if (keysPressed.current['KeyS']) {
      const newPos = currentPos.clone().add(forward.multiplyScalar(-speed));
      newPos.y = walkingHeight;
      if (isInsideStore(newPos)) {
        camera.position.copy(newPos);
      }
    }
    if (keysPressed.current['KeyA']) {
      const newPos = currentPos.clone().add(right.multiplyScalar(-speed));
      newPos.y = walkingHeight;
      if (isInsideStore(newPos)) {
        camera.position.copy(newPos);
      }
    }
    if (keysPressed.current['KeyD']) {
      const newPos = currentPos.clone().add(right.multiplyScalar(speed));
      newPos.y = walkingHeight;
      if (isInsideStore(newPos)) {
        camera.position.copy(newPos);
      }
    }
  });

  // Collision detection - keep player inside store boundaries
  const isInsideStore = (position) => {
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
