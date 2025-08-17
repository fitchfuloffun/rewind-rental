type SimpleShelfProps = {
  position: [x: number, y: number, z: number];
  color?: string;
  rotation?: [x: number, y: number, z: number];
};
// Simple box component for shelves
export function SimpleShelf({
  position,
  color,
  rotation = [0, 0, 0],
}: SimpleShelfProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
