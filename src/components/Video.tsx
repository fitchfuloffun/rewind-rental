import { useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Color, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { MovieData } from "@/App.tsx";
import { VIDEO_DIMENSIONS } from "@/constants.ts";
import { useCrosshair } from "../providers/CrosshairProvider.tsx";

// Import the hook

type VideoProps = {
  position: [x: number, y: number, z: number];
  movieData: MovieData;
  onVideoClick: (movie: MovieData) => void;
};

export function Video({
  position = [0, 0, 0],
  movieData,
  onVideoClick,
}: VideoProps) {
  const { WIDTH, HEIGHT, DEPTH } = VIDEO_DIMENSIONS;
  const meshRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, movieData.cover);
  const { hoveredObject, registerObject, unregisterObject } = useCrosshair();

  // Check if this specific video is hovered
  const hovered = hoveredObject === meshRef.current;

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
      const id = `video-${movieData.id}`;
      registerObject(meshRef.current, id);

      return () => unregisterObject(id);
    }
  }, [registerObject, unregisterObject, movieData.id]);

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
    <mesh
      ref={meshRef}
      material={materials}
      position={position}
      scale={[currentScale, currentScale, currentScale]}
    >
      <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
    </mesh>
  );
}
