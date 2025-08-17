import { VIDEO_DIMENSIONS } from "@/constants.ts";

export function VideoPlaceholder({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry
        args={[
          VIDEO_DIMENSIONS.WIDTH,
          VIDEO_DIMENSIONS.HEIGHT,
          VIDEO_DIMENSIONS.DEPTH,
        ]}
      />
      <meshBasicMaterial color="white" wireframe={true} />
    </mesh>
  );
}
