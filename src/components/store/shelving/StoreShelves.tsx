import { MovieData, MoviesBySection } from "@/components/store/StoreScene.tsx";
import { ShelfGroup } from "@/components/store/shelving/ShelfGroup.tsx";
import { SHELF_DIMENSIONS, STORE_DIMENSIONS } from "@/constants.ts";

export function StoreShelves({
  onVideoClick,
  moviesBySection,
}: {
  onVideoClick: (movie: MovieData) => void;
  moviesBySection: MoviesBySection;
}) {
  const genreProps: Record<
    string,
    { position: [number, number, number]; rotation: [number, number, number] }
  > = {
    Action: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Adventure: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Animation: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Comedy: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 6,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Crime: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 6,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Documentary: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 6,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Drama: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Family: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Fantasy: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    History: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Horror: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Music: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Mystery: {
      position: [
        -STORE_DIMENSIONS.HALF_WIDTH + SHELF_DIMENSIONS.DEPTH + 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Romance: {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    "Science Fiction": {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    "TV Movie": {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 14,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, Math.PI / 2, 0],
    },
    Thriller: {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 2,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    War: {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 4,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
    Western: {
      position: [
        STORE_DIMENSIONS.HALF_WIDTH - SHELF_DIMENSIONS.DEPTH - 8,
        1.5,
        STORE_DIMENSIONS.HALF_DEPTH - SHELF_DIMENSIONS.WIDTH * 6,
      ],
      rotation: [0, -Math.PI / 2, 0],
    },
  };

  return (
    <>
      {/* Simple shelves at the front of the store */}
      <ShelfGroup
        position={[0, 1.5, 7]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.popular}
        signText="Popular Flicks"
      />
      {/* Movies by genre */}
      {Object.entries(moviesBySection.moviesByGenre).map(([genre, movies]) => (
        <ShelfGroup
          key={`genre-${genre}`}
          position={genreProps[genre].position ?? [0, 1.5, 0]}
          rotation={genreProps[genre].rotation ?? [0, 0, 0]}
          onVideoClick={onVideoClick}
          movies={movies}
          signText={genre}
        />
      ))}
      {/* Nic Cage aisle */}
      <ShelfGroup
        position={[-4, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.cage?.slice(0, 40)}
        signText="Cage is all the rage"
      />
      <ShelfGroup
        position={[4, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.cage?.slice(40, 80)}
        signText="Cage is all the rage"
      />
      {/*Amy's Picks*/}
      <ShelfGroup
        position={[STORE_DIMENSIONS.HALF_WIDTH - 0.5, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.twilight}
        signText="Amy's Picks"
      />
      {/* Trending */}
      <ShelfGroup
        position={[
          -8,
          1.5,
          -STORE_DIMENSIONS.HALF_DEPTH + SHELF_DIMENSIONS.DEPTH,
        ]}
        rotation={[0, 0, 0]}
        onVideoClick={onVideoClick}
        movies={moviesBySection.trending}
        signText="Trending"
      />
    </>
  );
}
