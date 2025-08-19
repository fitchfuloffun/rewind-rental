import { StoreDoor } from "@/components/StoreDoor.tsx";
import { StoreFloor } from "@/components/StoreFloor.tsx";
import { StoreWall } from "@/components/StoreWall.tsx";
import { TV } from "@/components/TV.tsx";
import { STORE_DIMENSIONS } from "@/constants";
import { getAssetUrl } from "@/utils/asset.ts";

export function StoreStructure() {
  const { WIDTH, DEPTH, HEIGHT, HALF_WIDTH, HALF_DEPTH, HALF_HEIGHT } =
    STORE_DIMENSIONS;

  return (
    <group>
      {/* StoreFloor */}
      <StoreFloor />

      {/* Back wall */}
      <StoreWall
        dimensions={[WIDTH, HEIGHT]}
        position={[0, HALF_HEIGHT, -HALF_DEPTH]}
      />

      {/* Front wall with entrance */}
      <StoreWall
        dimensions={[WIDTH, HEIGHT]}
        position={[0, HALF_HEIGHT, HALF_DEPTH]}
        rotation={[0, Math.PI, 0]}
      />
      <StoreDoor />

      {/* Left wall with windows */}
      <StoreWall
        dimensions={[DEPTH, HEIGHT]}
        position={[-HALF_WIDTH, HALF_HEIGHT, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Right wall with windows */}
      <StoreWall
        dimensions={[DEPTH, HEIGHT]}
        position={[HALF_WIDTH, HALF_HEIGHT, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      <TV
        position={[-HALF_WIDTH + 1, HEIGHT - 1, -HALF_DEPTH + 1]}
        rotation={[Math.PI / 4, Math.PI / 4, -Math.PI / 6]}
        playlist={[
          getAssetUrl("/assets/textures/piracy.mp4"),
          getAssetUrl("/assets/textures/classification.mp4"),
        ]}
        volume={1}
      />

      {/* Roof */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, 0]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}
