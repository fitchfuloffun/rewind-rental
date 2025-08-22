import { MovieResult } from "moviedb-promise";
import { MoviesBySection } from "@/components/store/StoreScene.tsx";
import { ShelfGroup } from "@/components/store/shelving/ShelfGroup.tsx";
import { STORE_DIMENSIONS } from "@/constants.ts";

export function StoreShelves({
  onVideoClick,
  moviesBySection,
}: {
  onVideoClick: (movie: MovieResult) => void;

  moviesBySection: MoviesBySection;
}) {
  return (
    <>
      {/* Simple shelves at the front of the store */}
      <ShelfGroup
        position={[0, 1.5, 7]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.popular}
        signText="Popular Flicks"
      />

      {/* Nic Cage aisle */}
      <ShelfGroup
        position={[-4, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.cage.slice(0, 40)}
        signText="Cage is all the rage"
      />
      <ShelfGroup
        position={[4, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.cage.slice(40, 80)}
        signText="Cage is all the rage"
      />

      {/* Amy's Picks*/}
      <ShelfGroup
        position={[STORE_DIMENSIONS.HALF_WIDTH - 0.5, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.twilight}
        signText="Amy's Picks"
      />

      {/* Trending */}
      <ShelfGroup
        position={[-STORE_DIMENSIONS.HALF_WIDTH + 0.5, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.trending}
        signText="Trending"
      />
    </>
  );
}
