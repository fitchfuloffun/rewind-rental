import { useRef } from "react";
import { Box, Text } from "@react-three/drei";
import { Mesh, Vector3 } from "three";

type VideoSpineProps = {
  position: Vector3;
  title: string;
  color?: string;
};
export function VideoSpine({ position, title, color }: VideoSpineProps) {
  const meshRef = useRef<Mesh>(null);
  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.15, 1.8, 0.05]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, 0, 0.03]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {title}
      </Text>
    </group>
  );
}
