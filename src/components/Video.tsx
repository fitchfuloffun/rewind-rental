

import { useState } from "react"
import { MeshBasicMaterial } from "three";

export function Video({texture, position = [0,0,0], movieData, onVideoClick}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    onVideoClick(movieData);
  };

  const materials = [
    new MeshBasicMaterial({ color: '#1a1a1a' }), // Right side
    new MeshBasicMaterial({ color: '#1a1a1a' }), // Left side  
    new MeshBasicMaterial({ color: '#1a1a1a' }), // Top
    new MeshBasicMaterial({ color: '#1a1a1a' }), // Bottom
    new MeshBasicMaterial({ map: texture }),     // Front (cover)
    new MeshBasicMaterial({ color: '#1a1a1a' })  // Back
  ];

  return (
    <group position={position}>
      {/* Highlight outline - only visible on hover */}
      {hovered && (
        <mesh>
          <boxGeometry args={[1.15, 2.0, 0.36]} />
          <meshBasicMaterial 
            color="#ffcd3c" 
            transparent 
            opacity={0.6}
            wireframe={true}
          />
        </mesh>
      )}
      
      {/* Main video box */}
      <mesh 
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]}
      >
        <boxGeometry args={[1.05,1.9,0.26]} />
        <primitive object={materials} attach="material" />
      </mesh>
    </group>
  )
}