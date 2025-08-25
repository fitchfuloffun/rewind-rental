import { TV } from "@/components/store/TV.tsx";
import { StoreCounter } from "@/components/store/structure/StoreCounter.tsx";
import { StoreDoor } from "@/components/store/structure/StoreDoor.tsx";
import { StoreFloor } from "@/components/store/structure/StoreFloor.tsx";
import { StoreWall } from "@/components/store/structure/StoreWall.tsx";
import { STORE_DIMENSIONS } from "@/constants.ts";
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

      {/* Roof */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, 0]}>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <TV
        position={[-HALF_WIDTH + 1, HEIGHT - 1, -HALF_DEPTH + 1]}
        rotation={[Math.PI / 4, Math.PI / 4, -Math.PI / 6]}
        playlist={[
          getAssetUrl("/assets/textures/piracy.mp4"),
          getAssetUrl("/assets/textures/classification.mp4"),
        ]}
        volume={1}
        defaultMuted={true}
      />

      <StoreCounter position={[0, 0, -STORE_DIMENSIONS.HALF_DEPTH + 4]} />
    </group>
  );
}
