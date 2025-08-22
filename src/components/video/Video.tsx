import { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { MovieData } from "@/components/store/StoreScene.tsx";
import { MAX_INTERACTION_DISTANCE, VIDEO_DIMENSIONS } from "@/constants.ts";
import { useCrosshair } from "@/hooks/useCrosshair.ts";
import { useDebug } from "@/hooks/useDebug.ts";
import { getAssetUrl } from "@/utils/asset.ts";
import { getImageUrl } from "@/utils/image.ts";

// Import the hook
type VideoProps = {
  position: [x: number, y: number, z: number];
  movieData: MovieData;
  onVideoClick: (movie: MovieData) => void;
  idPrefix?: string;
};

export function Video({
  position = [0, 0, 0],
  movieData,
  onVideoClick,
  idPrefix,
}: VideoProps) {
  const { camera } = useThree();
  const { WIDTH, HEIGHT, DEPTH } = VIDEO_DIMENSIONS;
  const meshRef = useRef<Mesh>(null);
  const [isWithinDistance, setIsWithinDistance] = useState(false);
  const { debugMode } = useDebug();
  const cover = getImageUrl(movieData.poster_path, "poster", "medium");

  const texturePath =
    cover && cover != ""
      ? cover
      : getAssetUrl("/assets/textures/videoplaceholder.jpg");
  const texture = useLoader(TextureLoader, texturePath);
  const { hoveredObject, registerObject, unregisterObject } = useCrosshair();

  // Check if this specific video is hovered
  const hovered = hoveredObject === meshRef.current && isWithinDistance;

  // Check distance on each frame
  useFrame(() => {
    if (meshRef.current) {
      const videoPosition = meshRef.current.getWorldPosition(new Vector3());
      const distance = videoPosition.distanceTo(camera.position);
      const withinDistance = distance <= MAX_INTERACTION_DISTANCE;

      if (withinDistance !== isWithinDistance) {
        setIsWithinDistance(withinDistance);
      }
    }
  });
  const materials = useMemo(() => {
    const baseMaterial = new MeshStandardMaterial({ color: "#1a1a1a" });
    const coverMaterial = new MeshStandardMaterial({ map: texture });

    return [
      baseMaterial.clone(), // Right
      baseMaterial.clone(), // Left
      baseMaterial.clone(), // Top
      baseMaterial.clone(), // Bottom
      coverMaterial, // Front (cover)
      baseMaterial.clone(), // Back
    ];
  }, [texture]);

  // Register/unregister this object with the crosshair manager
  useEffect(() => {
    if (meshRef.current) {
      const id = `${idPrefix}-video-${movieData.id}-${position.join("-")}`;
      registerObject(meshRef.current, id);

      return () => unregisterObject(id);
    }
  }, [registerObject, unregisterObject, movieData.id, position, idPrefix]);

  // Update emissive properties when hover state changes
  useEffect(() => {
    const emissiveColor = new Color("#ffffff");
    const emissiveIntensity = hovered ? 0.3 : 0;
    const coverEmissiveIntensity = hovered ? 0.05 : 0;

    materials.forEach((material, index) => {
      material.emissive = emissiveColor;
      material.emissiveIntensity =
        index === 4 ? coverEmissiveIntensity : emissiveIntensity;
      material.needsUpdate = true;
    });
  }, [hovered, materials]);

  // Handle click events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (hovered && document.pointerLockElement) {
        event.preventDefault();
        event.stopPropagation();
        onVideoClick(movieData);
      }
    };

    if (hovered) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [hovered, movieData, onVideoClick]);

  const currentScale = hovered ? 1.05 : 1;

  return (
    <group position={position}>
      {debugMode && (
        <group position={[0, 0, 0.1]}>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[WIDTH, HEIGHT]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.04}
            color="black"
            maxWidth={WIDTH - 0.03}
            textAlign="center"
            anchorY="top"
          >
            ID: {movieData.id}
          </Text>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.04}
            overflowWrap="break-word"
            color="black"
            maxWidth={WIDTH - 0.03}
            textAlign="center"
            anchorY="top"
          >
            Title: {movieData.title}
          </Text>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.04}
            overflowWrap="break-word"
            color="black"
            maxWidth={WIDTH - 0.03}
            textAlign="center"
            anchorY="top"
          >
            Cover URL: {cover}
          </Text>
        </group>
      )}
      <mesh
        ref={meshRef}
        material={materials}
        scale={[currentScale, currentScale, currentScale]}
      >
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
      </mesh>
    </group>
  );
}
