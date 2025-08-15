import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Simple box component for shelves
function SimpleShelf({ position, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Floor component
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

// Combined keyboard and mouse controls
function FirstPersonControls() {
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
    
    // Apply mouse rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.y;
    camera.rotation.x = rotation.current.x;
    
    // Calculate forward/right vectors based on camera rotation
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    
    forward.applyQuaternion(camera.quaternion);
    right.applyQuaternion(camera.quaternion);
    
    // Movement with proper direction
    if (keysPressed.current['KeyW']) {
      camera.position.add(forward.multiplyScalar(speed));
    }
    if (keysPressed.current['KeyS']) {
      camera.position.add(forward.multiplyScalar(-speed));
    }
    if (keysPressed.current['KeyA']) {
      camera.position.add(right.multiplyScalar(-speed));
    }
    if (keysPressed.current['KeyD']) {
      camera.position.add(right.multiplyScalar(speed));
    }
  });

  return null;
}

// Main scene component
function BlockbusterScene() {
  return (
    <>
      <FirstPersonControls />
      
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} />
      
      {/* Floor */}
      <Floor />
      
      {/* Simple shelves to represent the store */}
      <SimpleShelf position={[-4, 0.5, -2]} color="#1a4c96" />
      <SimpleShelf position={[4, 0.5, -2]} color="#1a4c96" />
      <SimpleShelf position={[-4, 0.5, 2]} color="#ff6b6b" />
      <SimpleShelf position={[4, 0.5, 2]} color="#4ecdc4" />
      
      {/* Center display */}
      <mesh position={[0, 1, -4]}>
        <boxGeometry args={[3, 1, 0.3]} />
        <meshStandardMaterial color="#ffcd3c" />
      </mesh>
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <BlockbusterScene />
      </Canvas>
      
      {/* Controls display */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>Click to enable mouse look</div>
        <div>WASD to move, Mouse to look around</div>
        <div>ESC to unlock mouse</div>
      </div>
    </div>
  );
}