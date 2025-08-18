import { MovieData } from "@/App.tsx";
import { getAssetUrl } from "@/utils/asset.ts";
import { FirstPersonControls } from "./FirstPersonControls";
import { Lighting } from "./Lighting";
import { SimpleShelf } from "./SimpleShelf";
import { StoreSign } from "./StoreSign";
import { StoreStructure } from "./StoreStructure";

type StoreSceneProps = {
  onVideoClick: (movie: MovieData) => void;
  disableControls?: boolean;
};

const movies = [
  {
    id: 1,
    title: "Dungeons & Dragons: Honor Among Thieves",
    cover: getAssetUrl("/assets/textures/video.png"),
    price: 3.99,
  },
  {
    id: 2,
    title: "Superman",
    cover: getAssetUrl("/assets/textures/superman.png"),
    price: 5.99,
  },
];

// Main scene component
export function StoreScene({
  onVideoClick,
  disableControls = false,
}: StoreSceneProps) {
  return (
    <>
      <FirstPersonControls disabled={disableControls} />

      <Lighting />

      {/* Store structure */}
      <StoreStructure />

      {/* Simple shelves to represent the store */}
      <SimpleShelf
        position={[-4, 1.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={movies}
      />
      <SimpleShelf
        position={[-4, 1.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
      />
      <SimpleShelf
        position={[4, 1.5, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
      />
      <SimpleShelf
        position={[4, 1.5, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
      />

      {/* Center display */}
      <StoreSign />
    </>
  );
}
