import { STORE_DIMENSIONS } from "../constants";

// Floor component
export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[STORE_DIMENSIONS.WIDTH, STORE_DIMENSIONS.DEPTH]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}
