import { MovieResult } from "moviedb-promise";
import { SkyBox } from "@/components/store/Skybox.tsx";
import { StoreShelves } from "@/components/store/shelving/StoreShelves.tsx";
import { PerformanceTracker } from "@/debug/PerformanceTracker.tsx";
import { FirstPersonControls } from "../controls/FirstPersonControls.tsx";
import { Lighting } from "./lighting/Lighting.tsx";
import { StoreSign } from "./structure/StoreSign.tsx";
import { StoreStructure } from "./structure/StoreStructure.tsx";

type StoreSceneProps = {
  onVideoClick: (movie: MovieData) => void;
  disableControls?: boolean;
  moviesBySection: MoviesBySection;
};

export type MovieData = Pick<MovieResult, "id" | "title" | "overview"> & {
  poster_path?: string | null;
};

export type MoviesBySection = {
  moviesByGenre: Record<string, MovieData[]>;
  popular?: MovieData[];
  cage?: MovieData[];
  twilight?: MovieData[];
  trending?: MovieData[];
};

// Main scene component
export function StoreScene({
  onVideoClick,
  disableControls = false,
  moviesBySection,
}: StoreSceneProps) {
  return (
    <>
      <PerformanceTracker />
      <SkyBox />

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
