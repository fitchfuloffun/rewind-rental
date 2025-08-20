import { STORE_DIMENSIONS } from "../../../constants.ts";

type DownlightProps = {
  position?: [number, number];
  intensity?: number;
  color?: string;
};

export function Downlight({
  position = [0, 0],
  intensity = 1.5,
  color = "white",
}: DownlightProps) {
  const lightHeight = STORE_DIMENSIONS.HEIGHT - 0.2; // Just below ceiling

  return (
    <group position={[position[0], lightHeight, position[1]]}>
      {/* Physical light fixture */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.12, 0.1, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Light lens/diffuser */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={intensity}
        color={color}
        distance={8}
        decay={2}
      />
    </group>
  );
}
