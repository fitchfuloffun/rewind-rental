import { MovieData } from "@/App.tsx";
import { SHELF_DIMENSIONS } from "@/constants.ts";
import { TMDBMovieData, tmdbApi } from "@/services/tmdbApi.ts";
import { getImageUrl } from "@/utils/image.ts";
import { FirstPersonControls } from "./FirstPersonControls";
import { Lighting } from "./Lighting";
import { SimpleShelf } from "./SimpleShelf";
import { StoreSign } from "./StoreSign";
import { StoreStructure } from "./StoreStructure";

type StoreSceneProps = {
  onVideoClick: (movie: MovieData) => void;
  disableControls?: boolean;
};

const popularMovies = await Promise.all([
  tmdbApi.getPopularMovies(""),
  tmdbApi.getPopularMovies("page=2"),
]);

const movies = popularMovies.map((response, responseIndex: number) =>
  response.results.map((movie: TMDBMovieData, movieIndex: number) => ({
    id: `${responseIndex}${movieIndex}`,
    title: movie.title,
    description: movie.overview,
    cover: getImageUrl(movie.poster_path, "poster", "medium"),
    price: 9.99,
  })),
);

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
        position={[
          -SHELF_DIMENSIONS.HALF_WIDTH - 0.05,
          SHELF_DIMENSIONS.HALF_HEIGHT,
          7,
        ]}
        rotation={[0, 0, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={movies[0]}
        signText="Popular Flicks"
      />
      <SimpleShelf
        position={[
          SHELF_DIMENSIONS.HALF_WIDTH + 0.05,
          SHELF_DIMENSIONS.HALF_HEIGHT,
          7,
        ]}
        rotation={[0, 0, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={movies[1]}
        signText="Popular Flicks"
      />
      <SimpleShelf
        position={[-4, 1.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
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
