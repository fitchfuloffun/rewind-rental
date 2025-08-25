import { Suspense, useEffect, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Euler,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  Quaternion,
  Vector3,
} from "three";
import { MovieData } from "@/components/store/StoreScene.tsx";
import { InstancedShelfVideos } from "@/components/store/shelving/ShelfVideos.tsx";
import { SHELF_DIMENSIONS } from "@/constants.ts";
import { useCollisionMesh } from "@/hooks/useCollisionMesh.ts";
import { useDebug } from "@/hooks/useDebug.ts";

export type ShelfInstance = {
  position: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
  color?: string;
  videos?: (MovieData | undefined)[];
  signText?: string;
  idPrefix?: string;
  onVideoClick: (movie: MovieData) => void;
};

type InstancedShelfGroupProps = {
  shelves: ShelfInstance[];
};

// Helper component to visualize bounding spheres
function BoundingSphereHelper({ mesh }: { mesh: InstancedMesh }) {
  const sphereRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!mesh.boundingSphere) return;

    const sphere = mesh.boundingSphere;

    if (sphereRef.current) {
      sphereRef.current.position.copy(sphere.center);
      sphereRef.current.scale.setScalar(sphere.radius);
    }
  }, [mesh]);

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="blue" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

// Component for individual shelf text (can't be instanced due to unique content)
function ShelfText({
  position,
  rotation = [0, 0, 0],
  signText,
  width,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  signText: string;
  width: number;
}) {
  const { HALF_HEIGHT } = SHELF_DIMENSIONS;

  return (
    <group position={position} rotation={rotation}>
      <group position={[0, HALF_HEIGHT + 0.2, -0.2]}>
        <Suspense fallback={null}>
          <Text position={[0, 0.1, 0.3]} fontSize={0.2} maxWidth={width}>
            {signText}
          </Text>
        </Suspense>
      </group>
    </group>
  );
}

// Component for individual shelf videos (can't be instanced due to unique content)
// function ShelfVideos({
//   position,
//   rotation = [0, 0, 0],
//   videos,
//   onVideoClick,
//   idPrefix,
// }: {
//   position: [number, number, number];
//   rotation?: [number, number, number];
//   videos?: (MovieData | undefined)[];
//   onVideoClick: (movie: MovieData) => void;
//   idPrefix?: string;
// }) {
//   const { debugMode } = useDebug();
//   const { VIDEO_SLOTS } = SHELF_DIMENSIONS;
//
//   return (
//     <group position={position} rotation={rotation}>
//       <group rotation={[-0.2, 0, 0]}>
//         {!debugMode &&
//           videos &&
//           videos.map((video, index) => {
//             if (!video) return null;
//             return (
//               <Suspense
//                 key={`video-${video.id}`}
//                 fallback={<VideoPlaceholder position={VIDEO_SLOTS[index]} />}
//               >
//                 <Video
//                   position={VIDEO_SLOTS[index]}
//                   movieData={video}
//                   onVideoClick={onVideoClick}
//                   idPrefix={idPrefix}
//                 />
//               </Suspense>
//             );
//           })}
//
//         {debugMode &&
//           VIDEO_SLOTS.map((slot, index) => {
//             if (videos && videos[index]) {
//               const video = videos[index];
//               return (
//                 <Video
//                   key={`video-${video.title}`}
//                   position={slot}
//                   movieData={video}
//                   onVideoClick={onVideoClick}
//                 />
//               );
//             }
//
//             return (
//               <VideoPlaceholder
//                 key={`video-placeholder-${slot.join("-")}`}
//                 position={slot}
//               />
//             );
//           })}
//       </group>
//     </group>
//   );
// }

// Component to handle collision detection for each shelf
function CollisionBox({
  position,
  rotation = [0, 0, 0],
  shelfId,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  shelfId: string;
}) {
  const { WIDTH, HEIGHT, DEPTH } = SHELF_DIMENSIONS;
  const meshRef = useRef<Group | null>(null);
  const { updateCollisionBox } = useCollisionMesh(meshRef, shelfId);

  // Update collision box when position changes
  useEffect(() => {
    updateCollisionBox();
  }, [position, updateCollisionBox]);

  return (
    <group position={position} rotation={rotation} ref={meshRef}>
      <group rotation={[-0.2, 0, 0]}>
        {/* Invisible collision mesh that matches the main shelf body */}
        <mesh visible={false}>
          <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        </mesh>
      </group>
    </group>
  );
}

function makeMatrix(
  shelfPos: [number, number, number],
  shelfRot: [number, number, number],
  localPos: [number, number, number],
  tiltRot: [number, number, number] = [0, 0, 0],
  extraRot: [number, number, number] = [0, 0, 0], // <- just rotation, no pos
) {
  const parentQuat = new Quaternion().setFromEuler(new Euler(...shelfRot));
  const tiltQuat = new Quaternion().setFromEuler(new Euler(...tiltRot));
  const extraQuat = new Quaternion().setFromEuler(new Euler(...extraRot));

  // Combine rotations: parent * child
  const worldQuat = parentQuat.clone().multiply(tiltQuat).multiply(extraQuat);

  // Rotate local offset, then translate
  const worldPos = new Vector3(...localPos)
    .applyQuaternion(tiltQuat) // tilt the offset
    .applyQuaternion(parentQuat) // then rotate by shelf
    .add(new Vector3(...shelfPos));

  // Build final transform matrix
  return new Matrix4().compose(worldPos, worldQuat, new Vector3(1, 1, 1));
}

// Main instanced shelf group component
export function InstancedShelfGroup({ shelves }: InstancedShelfGroupProps) {
  const { WIDTH, HEIGHT, DEPTH, HALF_HEIGHT } = SHELF_DIMENSIONS;
  const { debugMode } = useDebug();

  // Refs for instanced meshes
  const mainShelfRef = useRef<InstancedMesh>(null);
  const bottomLedgeRef = useRef<InstancedMesh>(null);
  const signBackgroundRef = useRef<InstancedMesh>(null);
  const ledge1Ref = useRef<InstancedMesh>(null);
  const ledge2Ref = useRef<InstancedMesh>(null);
  const ledge3Ref = useRef<InstancedMesh>(null);
  const ledge4Ref = useRef<InstancedMesh>(null);
  const groupId = shelves.map((s) => s.position.join("-")).join("_");

  // Update instance matrices when shelves change
  useFrame(() => {
    if (!mainShelfRef.current) return;

    const tempColor = new Color();

    shelves.forEach((shelf, index) => {
      const shelfRotation = shelf.rotation || [0, 0, 0];
      const shelfPosition = shelf.position || [0, 0, 0];

      // Main shelf body (in tilted group at origin)
      const mainMatrix = makeMatrix(
        shelfPosition,
        shelfRotation,
        [0, 0, 0],
        [-0.2, 0, 0],
      );
      mainShelfRef.current?.setMatrixAt(index, mainMatrix);
      mainShelfRef.current?.setColorAt(
        index,
        tempColor.set(shelf.color || "#290b44"),
      );

      // Sign background (in tilted group at origin)
      const signBackgroundMatrix = makeMatrix(
        shelfPosition,
        shelfRotation,
        [0, HALF_HEIGHT + 0.2, 0],
        [0, 0, 0],
      );
      signBackgroundRef.current?.setMatrixAt(index, signBackgroundMatrix);
      signBackgroundRef.current?.setColorAt(index, tempColor.set("#1e3c72"));

      // Bottom ledge (in tilted group with additional rotation)
      const bottomMatrix = makeMatrix(
        shelfPosition,
        shelfRotation,
        [0, -1.1, -0.3],
        [-0.2, 0, 0],
        [-0.3, 0, 0],
      );
      bottomLedgeRef.current?.setMatrixAt(index, bottomMatrix);
      bottomLedgeRef.current?.setColorAt(
        index,
        tempColor.set(shelf.color || "#290b44"),
      );

      // Ledges (all in tilted group)
      const ledgeData = [
        { ref: ledge1Ref, yOffset: 0.8 },
        { ref: ledge2Ref, yOffset: 0 },
        { ref: ledge3Ref, yOffset: -0.75 },
        { ref: ledge4Ref, yOffset: -HALF_HEIGHT },
      ];

      ledgeData.forEach(({ ref, yOffset }) => {
        const ledgeMatrix = makeMatrix(
          shelfPosition,
          shelfRotation,
          [0, yOffset, 0.2],
          [-0.2, 0, 0],
        );
        ref.current?.setMatrixAt(index, ledgeMatrix);
        ref.current?.setColorAt(index, tempColor.set(shelf.color || "#290b44"));
      });
    });

    // Update all instance matrices
    const allRefs = [
      mainShelfRef,
      bottomLedgeRef,
      signBackgroundRef,
      ledge1Ref,
      ledge2Ref,
      ledge3Ref,
      ledge4Ref,
    ];
    allRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        if (ref.current.instanceColor) {
          ref.current.instanceColor.needsUpdate = true;
        }
        // Force bounding sphere recalculation
        ref.current.computeBoundingSphere();
      }
    });
  });

  return (
    <>
      {/* Instanced geometry - all identical shelf parts */}
      <instancedMesh
        ref={mainShelfRef}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={signBackgroundRef}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH - 0.1, 0.6, 0.1]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={bottomLedgeRef}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, 0.25, 1]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={ledge1Ref}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, 0.1, 0.45]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={ledge2Ref}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, 0.1, 0.45]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={ledge3Ref}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, 0.1, 0.45]} />
        <meshStandardMaterial />
      </instancedMesh>

      <instancedMesh
        ref={ledge4Ref}
        args={[undefined, undefined, shelves.length]}
      >
        <boxGeometry args={[WIDTH, 0.1, 0.45]} />
        <meshStandardMaterial />
      </instancedMesh>

      {/* Debug: Show bounding spheres */}
      {mainShelfRef.current && debugMode && (
        <BoundingSphereHelper mesh={mainShelfRef.current} />
      )}
      {signBackgroundRef.current && debugMode && (
        <BoundingSphereHelper mesh={signBackgroundRef.current} />
      )}
      {bottomLedgeRef.current && debugMode && (
        <BoundingSphereHelper mesh={bottomLedgeRef.current} />
      )}
      {ledge1Ref.current && debugMode && (
        <BoundingSphereHelper mesh={ledge1Ref.current} />
      )}

      <InstancedShelfVideos shelves={shelves} groupId={groupId} />

      {/* Non-instanced content - unique per shelf */}
      {shelves.map((shelf, index) => (
        <group key={index}>
          {/* Collision box for this shelf */}
          <CollisionBox
            position={shelf.position}
            rotation={shelf.rotation}
            shelfId={`${shelf.idPrefix}shelf-${shelf.position.join("-")}`}
          />

          <ShelfText
            position={shelf.position}
            rotation={shelf.rotation}
            signText={shelf.signText || "Sign Text"}
            width={WIDTH}
          />

          {/*<OptimizedShelfVideos // <-- This line*/}
          {/*  position={shelf.position}*/}
          {/*  rotation={shelf.rotation}*/}
          {/*  videos={shelf.videos}*/}
          {/*  onVideoClick={shelf.onVideoClick}*/}
          {/*  idPrefix={shelf.idPrefix}*/}
          {/*/>*/}
        </group>
      ))}
    </>
  );
}
