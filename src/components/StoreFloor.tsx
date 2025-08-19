import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import { getAssetUrl } from "@/utils/asset.ts";
import { STORE_DIMENSIONS } from "../constants";

// StoreFloor component
export function StoreFloor() {
  const texture = useLoader(
    TextureLoader,
    getAssetUrl("/assets/textures/carpet.jpg"),
  );

  const tileSize = 1; // How big each tile should appear
  const tilesX = STORE_DIMENSIONS.WIDTH / tileSize;
  const tilesY = STORE_DIMENSIONS.DEPTH / tileSize;

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(tilesX, tilesY); // Different repeats for X and Y
    texture.needsUpdate = true;
  }, [texture, tilesX, tilesY]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[STORE_DIMENSIONS.WIDTH, STORE_DIMENSIONS.DEPTH]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
