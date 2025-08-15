// Simple box component for shelves
export function SimpleShelf({ position, color, rotation = [0,0,0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[2, 3, 0.5]}  />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
