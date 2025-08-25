import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { MAX_INTERACTION_DISTANCE } from "@/constants.ts";
import { useCollisionMesh } from "@/hooks/useCollisionMesh.ts";
import { useCrosshair } from "@/hooks/useCrosshair.ts";
import { useDebug } from "@/hooks/useDebug.ts";

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
  const hingeGroupRef = useRef<Group>(null);

  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [isWithinDistance, setIsWithinDistance] = useState(false);
  const [hingeRotation, setHingeRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { hoveredObject, registerObject, unregisterObject } = useCrosshair();
  const { debugMode } = useDebug();

  const hovered =
    hoveredObject === counterEntranceRef.current && isWithinDistance;

  const material = useMemo(() => {
    return new MeshStandardMaterial({ color: "#A0522D" });
  }, []);

  // Animation parameters
  const targetRotation = isCounterOpen ? -Math.PI / 2 : 0; // -90 degrees to lift up
  const animationSpeed = 3;

  // Animate the hinge rotation
  useFrame((state, delta) => {
    if (counterEntranceRef.current) {
      const counterEntrancePosition =
        counterEntranceRef.current.getWorldPosition(new Vector3());
      const distance = counterEntrancePosition.distanceTo(
        state.camera.position,
      );
      const withinDistance = distance <= MAX_INTERACTION_DISTANCE;

      if (withinDistance !== isWithinDistance) {
        setIsWithinDistance(withinDistance);
      }
    }

    // Animate hinge rotation
    if (Math.abs(hingeRotation - targetRotation) > 0.01) {
      setIsAnimating(true);
      const direction = targetRotation > hingeRotation ? 1 : -1;
      const newRotation = hingeRotation + direction * animationSpeed * delta;

      // Clamp to target if we've overshot
      if (direction > 0) {
        setHingeRotation(Math.min(newRotation, targetRotation));
      } else {
        setHingeRotation(Math.max(newRotation, targetRotation));
      }
    } else {
      setIsAnimating(false);
    }

    // Apply rotation to the hinge group
    if (hingeGroupRef.current) {
      hingeGroupRef.current.rotation.x = -hingeRotation;
    }
  });

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
    if (isAnimating) return;
    if (isCounterOpen) {
      removeCollisionBox();
    } else {
      addCollisionBox(counterEntranceRef, "counterEntrance");
    }
  }, [isCounterOpen, addCollisionBox, removeCollisionBox, isAnimating]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (hovered && document.pointerLockElement && !isAnimating) {
        event.preventDefault();
        event.stopPropagation();
        setIsCounterOpen(!isCounterOpen);
      }
    };

    if (hovered) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [hovered, isCounterOpen, isAnimating]);

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

        {/* Hinged entrance panel */}
        <group position={[4, 2.2, -1.3]}>
          {/* Pivot point - positioned at the front edge */}
          {/* Debug sphere to show pivot point */}
          {debugMode && (
            <mesh>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="red" />
            </mesh>
          )}
          <group ref={hingeGroupRef}>
            {/* Panel positioned so its front edge is at the pivot */}
            <group position={[0, -0.1, -1.3]}>
              {" "}
              {/* Panel extends backward from pivot */}
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
      </group>
    </group>
  );
}
