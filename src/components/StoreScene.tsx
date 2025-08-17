import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { MovieData } from "@/App.tsx";
import { FirstPersonControls } from "./FirstPersonControls";
import { Floor } from "./Floor";
import { Lighting } from "./Lighting";
import { SimpleShelf } from "./SimpleShelf";
import { StoreSign } from "./StoreSign";
import { StoreStructure } from "./StoreStructure";
import { Video } from "./Video";

type StoreSceneProps = {
  onVideoClick: (movie: MovieData) => void;
  disableControls?: boolean;
};

// Main scene component
export function StoreScene({
  onVideoClick,
  disableControls = false,
}: StoreSceneProps) {
  const texture = useLoader(TextureLoader, "src/assets/textures/video.png");

  return (
    <>
      <FirstPersonControls disabled={disableControls} />

      <Video
        texture={texture}
        position={[0, 1, 0]}
        movieData={{
          title: "Dungeons & Dragons: Honor Among Thieves",
          price: 3.99,
        }}
        onVideoClick={onVideoClick}
      />

      <Lighting />

      {/* Floor and structure */}
      <Floor />
      <StoreStructure />

      {/* Simple shelves to represent the store */}
      <SimpleShelf
        position={[-4, 1.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
      />
      <SimpleShelf
        position={[4, 1.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
      />
      <SimpleShelf
        position={[-4, 1.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
      />
      <SimpleShelf
        position={[4, 1.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
      />

      {/* Center display */}
      <StoreSign />
    </>
  );
}
