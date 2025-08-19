import { MovieData } from "@/App.tsx";
import { ShelfGroup } from "@/components/ShelfGroup.tsx";

export function StoreShelves({
  onVideoClick,
  movies,
}: {
  onVideoClick: (movie: MovieData) => void;
  movies: MovieData[][];
}) {
  return (
    <>
      {/* Simple shelves at the front of the store */}
      <ShelfGroup
        position={[0, 1.5, 7]}
        onVideoClick={onVideoClick}
        movies={movies[0].concat(movies[1])}
        signText="Popular Flicks"
      />

      {/* Nic Cage aisle */}
      <ShelfGroup
        position={[-4, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={movies[2].slice(0, 40)}
        signText="Cage is all the rage"
      />
      <ShelfGroup
        position={[4, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onVideoClick={onVideoClick}
        movies={movies[2].slice(40, 80)}
        signText="Cage is all the rage"
      />
    </>
  );
}
