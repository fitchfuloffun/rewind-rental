// import { useLoader } from "@react-three/fiber";
import { StoreDoor } from "@/components/StoreDoor.tsx";
import { STORE_DIMENSIONS } from "@/constants";

// import { TextureLoader } from "three";

export function StoreStructure() {
  const { WIDTH, DEPTH, HEIGHT, HALF_WIDTH, HALF_DEPTH, HALF_HEIGHT } =
    STORE_DIMENSIONS;
  // const texture = useLoader(TextureLoader, "src/assets/textures/wall.png")

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, HALF_HEIGHT, -HALF_DEPTH]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshStandardMaterial color="#1a4c96" />
      </mesh>

      {/* Front wall with entrance */}
      <group position={[0, HALF_HEIGHT, HALF_DEPTH]} rotation={[0, Math.PI, 0]}>
        {/* Left side of front wall */}
        <mesh position={[-WIDTH * 0.3125, 0, 0]}>
          <planeGeometry args={[WIDTH * 0.375, HEIGHT]} />
          <meshStandardMaterial color="#1a4c96" />
        </mesh>
        {/* Right side of front wall */}
        <mesh position={[WIDTH * 0.3125, 0, 0]}>
          <planeGeometry args={[WIDTH * 0.375, HEIGHT]} />
          <meshStandardMaterial color="#1a4c96" />
        </mesh>
        {/* Top of entrance */}
        <mesh position={[0, HEIGHT * 0.333, 0]}>
          <planeGeometry args={[WIDTH * 0.25, HEIGHT * 0.333]} />
          <meshStandardMaterial color="#1a4c96" />
        </mesh>
      </group>

      <StoreDoor />

      {/* Left wall with windows */}
      <group>
        <mesh
          position={[-HALF_WIDTH, HALF_HEIGHT, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH, HEIGHT]} />
          <meshStandardMaterial color="#1a4c96" />
        </mesh>
        {/* Windows on left wall */}
        <mesh
          position={[-HALF_WIDTH + 0.01, HALF_HEIGHT, -DEPTH * 0.167]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH * 0.167, 3]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        <mesh
          position={[-HALF_WIDTH + 0.01, HALF_HEIGHT, DEPTH * 0.167]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH * 0.167, 3]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Right wall with windows */}
      <group>
        <mesh
          position={[HALF_WIDTH, HALF_HEIGHT, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH, HEIGHT]} />
          <meshStandardMaterial color="#1a4c96" />
        </mesh>
        {/* Windows on right wall */}
        <mesh
          position={[HALF_WIDTH - 0.01, HALF_HEIGHT, -DEPTH * 0.167]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH * 0.167, 3]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        <mesh
          position={[HALF_WIDTH - 0.01, HALF_HEIGHT, DEPTH * 0.167]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[DEPTH * 0.167, 3]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Roof */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, 0]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}
