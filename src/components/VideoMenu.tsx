import { Text } from '@react-three/drei';

export function VideoMenu({ movie, onClose, position }) {
  if (!movie) return null;
  
  return (
    <group position={position}>
      {/* Menu background */}
      <mesh>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#1a1a1a" opacity={0.9} transparent />
      </mesh>
      
      {/* Movie title */}
      <Text
        position={[0, 0.5, 0.01]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {movie.title}
      </Text>
      
      {/* Rent button */}
      <mesh position={[0, -0.3, 0.01]} onClick={() => console.log('Rented:', movie.title)}>
        <planeGeometry args={[1.5, 0.4]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
      <Text
        position={[0, -0.3, 0.02]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Rent - $3.99
      </Text>
      
      {/* Close button */}
      <mesh position={[1.2, 0.8, 0.01]} onClick={onClose}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#f44336" />
      </mesh>
      <Text
        position={[1.2, 0.8, 0.02]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
    </group>
  );
}