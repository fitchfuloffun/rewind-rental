import { Text } from "@react-three/drei";
import { MovieData } from "@/App.tsx";
import { Video } from "@/components/Video.tsx";
import { SHELF_DIMENSIONS, VIDEO_DIMENSIONS } from "@/constants.ts";

type SimpleShelfProps = {
  position: [x: number, y: number, z: number];
  color?: string;
  rotation?: [x: number, y: number, z: number];
  onVideoClick: (movie: MovieData) => void;
  videos?: MovieData[];
};
// Simple box component for shelves
export function SimpleShelf({
  position,
  color,
  rotation = [0, 0, 0],
  onVideoClick,
  videos,
}: SimpleShelfProps) {
  const { WIDTH, HEIGHT, DEPTH, HALF_HEIGHT, VIDEO_SLOTS } = SHELF_DIMENSIONS;
  return (
    <group position={position} rotation={rotation}>
      <group position={[0, HALF_HEIGHT + 0.5, -0.2]}>
        <mesh>
          <boxGeometry args={[WIDTH, 1, 0.1]} />
          <meshStandardMaterial color="#1e3c72" />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.4} maxWidth={WIDTH}>
          Genre
        </Text>
      </group>
      <group rotation={[-0.2, 0, 0]}>
        <mesh>
          <boxGeometry args={[WIDTH, HEIGHT, DEPTH]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -1.1, -0.3]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[WIDTH, 0.25, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/*{videos &&*/}
        {/*  videos.map((video, index) => {*/}
        {/*    return (*/}
        {/*      <Video*/}
        {/*        key={`video-${video.title}`}*/}
        {/*        position={VIDEO_SLOTS[index]}*/}
        {/*        movieData={video}*/}
        {/*        onVideoClick={onVideoClick}*/}
        {/*      />*/}
        {/*    );*/}
        {/*  })}*/}
        {VIDEO_SLOTS.map((slot, index) => {
          if (videos && videos[index]) {
            const video = videos[index];

            return (
              <Video
                key={`video-${video.title}`}
                position={slot}
                movieData={video}
                onVideoClick={onVideoClick}
              />
            );
          }

          return (
            <mesh position={slot}>
              <boxGeometry
                args={[
                  VIDEO_DIMENSIONS.WIDTH,
                  VIDEO_DIMENSIONS.HEIGHT,
                  VIDEO_DIMENSIONS.DEPTH,
                ]}
              />
              <meshBasicMaterial color="red" wireframe={true} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
