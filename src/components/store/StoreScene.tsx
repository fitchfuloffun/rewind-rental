import { MovieData } from "@/App.tsx";
import { StoreShelves } from "@/components/store/shelving/StoreShelves.tsx";
import { FirstPersonControls } from "../controls/FirstPersonControls.tsx";
import { Lighting } from "./lighting/Lighting.tsx";
import { StoreSign } from "./structure/StoreSign.tsx";
import { StoreStructure } from "./structure/StoreStructure.tsx";

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
