import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { MAX_INTERACTION_DISTANCE } from "@/constants.ts";
import { useCollisionMesh } from "@/hooks/useCollisionMesh.ts";
import { useCrosshair } from "@/hooks/useCrosshair.ts";

export function StoreCounter({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const counterRef1 = useRef<Group | null>(null);
  const counterRef2 = useRef<Group | null>(null);
  const counterEntranceRef = useRef<Mesh>(null);
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [isWithinDistance, setIsWithinDistance] = useState(false);
  const { hoveredObject, registerObject, unregisterObject } = useCrosshair();

  const hovered =
    hoveredObject === counterEntranceRef.current && isWithinDistance;
  const material = useMemo(() => {
    return new MeshStandardMaterial({ color: "#A0522D" });
  }, []);

  useFrame(({ camera }) => {
    if (counterEntranceRef.current) {
      const counterEntrancePosition =
        counterEntranceRef.current.getWorldPosition(new Vector3());
      const distance = counterEntrancePosition.distanceTo(camera.position);
      const withinDistance = distance <= MAX_INTERACTION_DISTANCE;

      if (withinDistance !== isWithinDistance) {
        setIsWithinDistance(withinDistance);
      }
    }
  });
  useEffect(() => {
    console.log(hoveredObject);
  }, [hoveredObject]);

  useEffect(() => {
    if (counterEntranceRef.current) {
      const id = "counterEntrance";
      registerObject(counterEntranceRef.current, id);

      return () => unregisterObject(id);
    }
  }, [registerObject, unregisterObject]);

  useEffect(() => {
    material.emissive = new Color("#ffffff");
    material.emissiveIntensity = hovered ? 0.1 : 0;
    material.needsUpdate = true;
  }, [hovered, material]);

  useCollisionMesh(counterRef1, "counter");
  useCollisionMesh(counterRef2, "counter2");

  const { addCollisionBox, removeCollisionBox } = useCollisionMesh(
    counterEntranceRef,
    "counterEntrance",
  );

  useEffect(() => {
    if (isCounterOpen) {
      removeCollisionBox();
    } else {
      addCollisionBox(counterEntranceRef, "counterEntrance");
    }
  }, [isCounterOpen, addCollisionBox, removeCollisionBox]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (hovered && document.pointerLockElement) {
        event.preventDefault();
        event.stopPropagation();
        setIsCounterOpen(!isCounterOpen);
      }
    };

    if (hovered) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [hovered, isCounterOpen]);

  return (
    <group position={position} rotation={rotation}>
      <group ref={counterRef1}>
        <mesh>
          <boxGeometry args={[10, 4, 1.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      <group position={[-4, 0, -2.375]} ref={counterRef2}>
        <mesh>
          <boxGeometry args={[2, 4, 3.25]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      <group>
        <group position={[0, 2.1, -0.25]}>
          <mesh>
            <boxGeometry args={[10, 0.2, 2]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
          <group position={[3.5, 0.1, -0.9]}>
            <mesh>
              <boxGeometry args={[0.4, 0.01, 0.2]} />
              <meshStandardMaterial
                color="lightgrey"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            <mesh
              position={[0, 0.02, -0.12]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshStandardMaterial
                color="silver"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          </group>
          <group position={[4.5, 0.1, -0.9]}>
            <mesh>
              <boxGeometry args={[0.4, 0.01, 0.2]} />
              <meshStandardMaterial
                color="lightgrey"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            <mesh
              position={[0, 0.02, -0.12]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshStandardMaterial
                color="silver"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>
        <mesh position={[-4, 2.1, -2.5]}>
          <boxGeometry args={[2, 0.2, 3]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        {/* Entrance */}
        <group position={[4, 2.1, -2.6]}>
          <mesh material={material} ref={counterEntranceRef}>
            <boxGeometry args={[2, 0.2, 2.6]} />
          </mesh>
          <mesh position={[-0.5, 0.1, 1.24]}>
            <boxGeometry args={[0.4, 0.01, 0.2]} />
            <meshStandardMaterial
              color="silver"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0.5, 0.1, 1.24]}>
            <boxGeometry args={[0.4, 0.01, 0.2]} />
            <meshStandardMaterial
              color="silver"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
