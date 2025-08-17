import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Mesh, MeshStandardMaterial, Texture, Vector2 } from "three";
import { MovieData } from "@/App.tsx";

type VideoProps = {
  texture: Texture;
  position: [x: number, y: number, z: number];
  movieData: MovieData;
  onVideoClick: (movie: MovieData) => void;
};

export function Video({
  texture,
  position = [0, 0, 0],
  movieData,
  onVideoClick,
}: VideoProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const { camera, raycaster } = useThree();
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

  // Update emissive properties when hover state changes
  useEffect(() => {
    const emissiveColor = new Color("#ffffff");
    const emissiveIntensity = hovered ? 0.3 : 0;
    const coverEmissiveIntensity = hovered ? 0.05 : 0; // Less intense on cover

    materials.forEach((material, index) => {
      material.emissive = emissiveColor;
      material.emissiveIntensity =
        index === 4 ? coverEmissiveIntensity : emissiveIntensity;
      material.needsUpdate = true;
    });
  }, [hovered, materials]);

  // Check crosshair intersection every frame
  useFrame(() => {
    if (!meshRef.current) return;

    // Raycast from screen center (crosshair position)
    raycaster.setFromCamera(new Vector2(0, 0), camera);

    const intersects = raycaster.intersectObject(meshRef.current, false);
    const isCurrentlyHovered = intersects.length > 0;

    if (isCurrentlyHovered !== hovered) {
      setHovered(isCurrentlyHovered);
    }
  });

  // Handle click events
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Only handle clicks if pointer is locked and this object is hovered
      if (hovered && document.pointerLockElement) {
        event.preventDefault();
        event.stopPropagation();
        onVideoClick(movieData);
      }
    };

    // Add click listener to document when hovered
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
      <boxGeometry args={[1.05, 1.9, 0.26]} />
    </mesh>
  );
}
