import { MovieData } from "@/App.tsx";
import { SimpleShelf } from "@/components/store/shelving/SimpleShelf.tsx";
import { SHELF_DIMENSIONS } from "@/constants.ts";

type ShelfGroupProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  onVideoClick: (movie: MovieData) => void;
  movies: MovieData[];
  signText?: string;
};
export function ShelfGroup({
  position,
  rotation = [0, 0, 0],
  onVideoClick,
  movies,
  signText,
}: ShelfGroupProps) {
  return (
    <group position={position} rotation={rotation}>
      <SimpleShelf
        position={[-SHELF_DIMENSIONS.HALF_WIDTH, 0, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={movies.slice(0, 20)}
        signText={signText}
        idPrefix={`${position.join("-")}-`}
      />
      <SimpleShelf
        position={[SHELF_DIMENSIONS.HALF_WIDTH, 0, 0]}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={movies.slice(20, 40)}
        signText={signText}
        idPrefix={`${position.join("-")}-`}
      />
    </group>
  );
}
