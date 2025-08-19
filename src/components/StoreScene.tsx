import { MovieData } from "@/App.tsx";
import { StoreShelves } from "@/components/StoreShelves.tsx";
import { FirstPersonControls } from "./FirstPersonControls";
import { Lighting } from "./Lighting";
import { StoreSign } from "./StoreSign";
import { StoreStructure } from "./StoreStructure";

type StoreSceneProps = {
  onVideoClick: (movie: MovieData) => void;
  disableControls?: boolean;
  movies: MovieData[][];
};

// Main scene component
export function StoreScene({
  onVideoClick,
  disableControls = false,
  movies,
}: StoreSceneProps) {
  return (
    <>
      <FirstPersonControls disabled={disableControls} />

      <Lighting />

      <StoreShelves onVideoClick={onVideoClick} movies={movies} />
      {/* Store structure */}
      <StoreStructure />

      {/* Center display */}
      <StoreSign />
    </>
  );
}
