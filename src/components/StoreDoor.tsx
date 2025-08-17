import { STORE_DIMENSIONS } from "@/constants";

export function StoreDoor() {
  const { HALF_DEPTH, HEIGHT, WIDTH } = STORE_DIMENSIONS;
  const doorHeight = HEIGHT - HEIGHT * 0.333;
  return (
    <group position={[0, HEIGHT - doorHeight, HALF_DEPTH]}>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[(WIDTH * 0.25) / 2, doorHeight, 0.2]} />
        <meshStandardMaterial />
      </mesh>
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[(WIDTH * 0.25) / 2, doorHeight, 0.2]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}
