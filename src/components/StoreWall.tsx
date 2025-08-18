import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Object3D, RepeatWrapping, TextureLoader } from "three";
import { useCollisionMesh } from "@/hooks/useCollisionMesh.ts";

type StoreWallProps = {
  dimensions: [number, number];
  position: [number, number, number];
  rotation?: [x: number, y: number, z: number];
};
export function StoreWall({
  dimensions,
  position,
  rotation = [0, 0, 0],
}: StoreWallProps) {
  const texture = useLoader(TextureLoader, "/assets/textures/yellowwall.jpeg");

  const tileSize = 1; // How big each tile should appear
  const tilesX = dimensions[0] / tileSize;
  const tilesY = dimensions[1] / tileSize;

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(tilesX, tilesY); // Different repeats for X and Y
  }, [texture, tilesX, tilesY]);
  const wallId = `wall-${position.join("-")}`;
  const meshRef = useRef<Object3D | null>(null);

  const { updateCollisionBox } = useCollisionMesh(meshRef, wallId);

  // Update collision box when position changes
  useEffect(() => {
    updateCollisionBox();
  }, [position, updateCollisionBox]);
  return (
    <group ref={meshRef}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={dimensions} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
