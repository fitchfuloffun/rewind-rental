import { MovieResult } from "moviedb-promise";
import { StoreShelves } from "@/components/store/shelving/StoreShelves.tsx";
import { FirstPersonControls } from "../controls/FirstPersonControls.tsx";
import { Lighting } from "./lighting/Lighting.tsx";
import { StoreSign } from "./structure/StoreSign.tsx";
import { StoreStructure } from "./structure/StoreStructure.tsx";

type StoreSceneProps = {
  onVideoClick: (movie: MovieResult) => void;
  disableControls?: boolean;
  moviesBySection: MoviesBySection;
};

export type MoviesBySection = {
  popular: (MovieResult | undefined)[];
  cage: (MovieResult | undefined)[];
  twilight: (MovieResult | undefined)[];
  trending: (MovieResult | undefined)[];
};

// Main scene component
export function StoreScene({
  onVideoClick,
  disableControls = false,
  moviesBySection,
}: StoreSceneProps) {
  return (
    <>
      <FirstPersonControls disabled={disableControls} />

      <Lighting />

      <StoreShelves
        onVideoClick={onVideoClick}
        moviesBySection={moviesBySection}
      />
      {/* Store structure */}
      <StoreStructure />

      {/* Center display */}
      <StoreSign />
    </>
  );
}
