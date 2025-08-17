import { Text } from "@react-three/drei";
import { STORE_DIMENSIONS } from "../constants";

export function StoreSign() {
  return (
    <group position={[0, 3.5, -STORE_DIMENSIONS.HALF_DEPTH]}>
      {/* Sign background */}
      <mesh>
        <boxGeometry args={[8, 1.5, 0.1]} />
        <meshStandardMaterial color="#1e3c72" />
      </mesh>

      {/* Sign text */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.4}
        color="#ffcd3c"
        anchorX="center"
        anchorY="middle"
        maxWidth={7}
        textAlign="center"
      >
        REWIND RENTAL
      </Text>
    </group>
  );
}
