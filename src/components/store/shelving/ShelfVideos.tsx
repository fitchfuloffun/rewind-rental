import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { MovieData } from "@/components/store/StoreScene.tsx";
import {
  MAX_INTERACTION_DISTANCE,
  MAX_VIEW_DISTANCE,
  SHELF_DIMENSIONS,
  VIDEO_DIMENSIONS,
} from "@/constants.ts";
import { useCrosshair } from "@/hooks/useCrosshair.ts";
import { getImageUrl } from "@/utils/image.ts";

// Helper to create world matrix for video position
function makeVideoMatrix(
  shelfPos: [number, number, number],
  shelfRot: [number, number, number],
  videoSlotPos: [number, number, number],
): Matrix4 {
  const tiltRot = [-0.2, 0, 0];
  const shelfQuat = new Quaternion().setFromEuler(new Euler(...shelfRot));
  const tiltQuat = new Quaternion().setFromEuler(new Euler(...tiltRot));
  const combinedQuat = shelfQuat.clone().multiply(tiltQuat);

  const rotatedSlotPos = new Vector3(...videoSlotPos)
    .applyQuaternion(tiltQuat)
    .applyQuaternion(shelfQuat);

  const finalPos = new Vector3(...shelfPos).add(rotatedSlotPos);

  return new Matrix4().compose(finalPos, combinedQuat, new Vector3(1, 1, 1));
}

export function InstancedShelfVideos({
  shelves,
  groupId, // Add unique identifier for each shelf group
}: {
  shelves: Array<{
    position: [number, number, number];
    rotation?: [number, number, number];
    videos?: (MovieData | undefined)[];
    onVideoClick: (movie: MovieData) => void;
  }>;
  groupId: string;
}) {
  const { camera } = useThree();
  const { VIDEO_SLOTS } = SHELF_DIMENSIONS;
  const vhsBoxRef = useRef<InstancedMesh>(null);
  const { hoveredTarget, registerObject, unregisterObject } = useCrosshair();

  const [withinInteractDistanceVideos, setWithinInteractDistanceVideos] =
    useState<Set<number>>(new Set());
  const [withinViewDistanceVideos, setWithinViewDistanceVideos] = useState<
    Set<number>
  >(new Set());

  // Check if a specific video instance is hovered
  const getIsHovered = (index: number) => {
    return (
      hoveredTarget?.object === vhsBoxRef.current &&
      hoveredTarget?.instanceId === index &&
      withinInteractDistanceVideos.has(index)
    );
  };

  // Build video data once - always the same length
  const allVideos = useMemo(
    () =>
      shelves.flatMap((shelf, shelfIndex) =>
        VIDEO_SLOTS.map((slotPos, slotIndex) => ({
          shelfIndex,
          slotIndex,
          movieData: shelf.videos?.[slotIndex],
          onVideoClick: shelf.onVideoClick,
          hasVideo: !!shelf.videos?.[slotIndex],
          matrix: makeVideoMatrix(
            shelf.position,
            shelf.rotation || [0, 0, 0],
            slotPos,
          ),
        })),
      ),
    [shelves],
  );

  const videosWithData = useMemo(
    () => allVideos.filter((v) => v.hasVideo),
    [allVideos],
  );

  // Pre-load all textures - always call this hook with same array length
  const textureUrls = useMemo(() => {
    const urls: string[] = [];
    videosWithData.forEach((video) => {
      if (video.movieData?.poster_path) {
        const url = getImageUrl(
          video.movieData.poster_path,
          "poster",
          "medium",
        );
        if (url && !urls.includes(url)) {
          urls.push(url);
        }
      }
    });
    // Always return at least one URL to keep hook calls consistent
    return urls.length > 0 ? urls : ["/placeholder.jpg"];
  }, [videosWithData]);

  const textures = useTexture(textureUrls, (loadedTextures) => {
    const textureArray = Array.isArray(loadedTextures)
      ? loadedTextures
      : [loadedTextures];
    textureArray.forEach((texture) => {
      if (texture) {
        texture.flipY = true;
        texture.generateMipmaps = false;
      }
    });
  });

  // Texture lookup function
  const getTexture = (video: (typeof videosWithData)[0]) => {
    if (!video.movieData?.poster_path) return null;
    const url = getImageUrl(video.movieData.poster_path, "poster", "medium");
    if (!url) return null;
    const index = textureUrls.indexOf(url);
    if (index === -1) return null;
    return Array.isArray(textures) ? textures[index] : textures;
  };

  // Register the instanced mesh with crosshair system using unique ID
  useEffect(() => {
    if (vhsBoxRef.current) {
      const uniqueId = `instanced-videos-${groupId}`;
      registerObject(vhsBoxRef.current, uniqueId);
      return () => unregisterObject(uniqueId);
    }
  }, [registerObject, unregisterObject, groupId]);

  // Set up VHS box instances once
  useEffect(() => {
    if (!vhsBoxRef.current || videosWithData.length === 0) return;

    const tempColor = new Color("#ffffff");

    videosWithData.forEach((video, i) => {
      vhsBoxRef.current!.setMatrixAt(i, video.matrix);
      vhsBoxRef.current!.setColorAt(i, tempColor);
    });

    vhsBoxRef.current.count = videosWithData.length;
    vhsBoxRef.current.instanceMatrix.needsUpdate = true;
    if (vhsBoxRef.current.instanceColor) {
      vhsBoxRef.current.instanceColor.needsUpdate = true;
    }
  }, [videosWithData.length, textureUrls.length, videosWithData]);

  // Handle distance checking and update visual states
  useFrame(() => {
    if (!vhsBoxRef.current) return;

    const tempColor = new Color();
    const newWithinInteractDistance = new Set<number>();
    const newWithinViewDistance = new Set<number>();

    videosWithData.forEach((video, i) => {
      const worldPos = new Vector3().setFromMatrixPosition(video.matrix);
      const distance = camera.position.distanceTo(worldPos);

      if (distance <= MAX_INTERACTION_DISTANCE) {
        newWithinInteractDistance.add(i);
      }
      if (distance <= MAX_VIEW_DISTANCE) {
        newWithinViewDistance.add(i);
      }

      // Update VHS box appearance based on crosshair hover
      const isHovered = getIsHovered(i);
      const scale = isHovered ? 1.05 : 1;
      const scaledMatrix = video.matrix
        .clone()
        .scale(new Vector3(scale, scale, scale));
      vhsBoxRef.current!.setMatrixAt(i, scaledMatrix);

      tempColor.set(isHovered ? "#ffffff" : "#ffffff"); // Brighter yellow
      vhsBoxRef.current!.setColorAt(i, tempColor);
    });

    setWithinInteractDistanceVideos(newWithinInteractDistance);
    setWithinViewDistanceVideos(newWithinViewDistance);

    // Update instances
    vhsBoxRef.current.instanceMatrix.needsUpdate = true;
    if (vhsBoxRef.current.instanceColor) {
      vhsBoxRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Handle crosshair-based clicks with distance checking
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        hoveredTarget?.object === vhsBoxRef.current &&
        hoveredTarget.instanceId !== undefined &&
        document.pointerLockElement
      ) {
        const instanceId = hoveredTarget.instanceId;
        if (
          instanceId < videosWithData.length &&
          withinInteractDistanceVideos.has(instanceId)
        ) {
          const video = videosWithData[instanceId];

          if (video.movieData) {
            event.preventDefault();
            event.stopPropagation();
            video.onVideoClick(video.movieData);
          }
        }
      }
    };

    if (hoveredTarget?.object === vhsBoxRef.current) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [hoveredTarget, videosWithData, withinInteractDistanceVideos]);

  if (videosWithData.length === 0) return null;

  return (
    <>
      {/* VHS Boxes with crosshair hover support */}
      <instancedMesh
        ref={vhsBoxRef}
        args={[undefined, undefined, videosWithData.length]}
        frustumCulled={true}
      >
        <boxGeometry
          args={[
            VIDEO_DIMENSIONS.WIDTH,
            VIDEO_DIMENSIONS.HEIGHT,
            VIDEO_DIMENSIONS.DEPTH,
          ]}
        />
        <meshBasicMaterial color="#1a1a1a" />
      </instancedMesh>

      {/* Individual hover highlight meshes */}
      {videosWithData.map((video, index) => {
        const isHovered = getIsHovered(index);
        if (!isHovered) return null;

        const scale = 1.08; // Slightly larger than the VHS box
        const highlightMatrix = video.matrix
          .clone()
          .scale(new Vector3(scale, scale, scale));

        return (
          <mesh
            key={`hover-${video.shelfIndex}-${video.slotIndex}`}
            matrix={highlightMatrix}
            matrixAutoUpdate={false}
          >
            <boxGeometry
              args={[
                VIDEO_DIMENSIONS.WIDTH,
                VIDEO_DIMENSIONS.HEIGHT,
                VIDEO_DIMENSIONS.DEPTH,
              ]}
            />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.6}
              depthTest={false}
            />
          </mesh>
        );
      })}

      {/* Movie Covers - only visible and close ones */}
      {videosWithData.map((video, index) => {
        if (!withinViewDistanceVideos.has(index)) return null;

        const texture = getTexture(video);
        if (!texture) return null;

        // Position cover slightly forward
        const coverMatrix = video.matrix.clone();
        const forward = new Vector3(0, 0, VIDEO_DIMENSIONS.DEPTH / 2 + 0.01);
        forward.applyMatrix4(video.matrix);
        coverMatrix.setPosition(forward);

        return (
          <mesh
            key={`cover-${video.shelfIndex}-${video.slotIndex}`}
            matrix={coverMatrix}
            matrixAutoUpdate={false}
          >
            <planeGeometry
              args={[
                VIDEO_DIMENSIONS.WIDTH * 0.9,
                VIDEO_DIMENSIONS.HEIGHT * 0.9,
              ]}
            />
            <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
          </mesh>
        );
      })}
    </>
  );
}
