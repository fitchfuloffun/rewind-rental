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

const MOVIES_PER_SHELF = 20;
export function ShelfGroup({
  position,
  rotation = [0, 0, 0],
  onVideoClick,
  movies,
  signText,
}: ShelfGroupProps) {
  const shelfCount = Math.ceil(movies.length / MOVIES_PER_SHELF);

  // Calculate total width and offset to center the group
  const totalWidth = SHELF_DIMENSIONS.WIDTH * shelfCount;
  const centreOffset = -totalWidth / 2 + SHELF_DIMENSIONS.WIDTH / 2;

  let shelves = [];

  for (let i = 0; i < shelfCount; i++) {
    const start = i * MOVIES_PER_SHELF;
    const end = start + MOVIES_PER_SHELF;
    const shelfMovies = movies.slice(start, end);
    const shelfPosition: [number, number, number] = [
      centreOffset + SHELF_DIMENSIONS.WIDTH * i,
      0,
      0,
    ];

    shelves.push(
      <SimpleShelf
        key={i}
        position={shelfPosition}
        color="#290b44"
        onVideoClick={onVideoClick}
        videos={shelfMovies}
        signText={signText}
        idPrefix={`${position.join("-")}-${i}-`}
      />,
    );
  }

  return (
    <group position={position} rotation={rotation}>
      {shelves}
    </group>
  );
}
