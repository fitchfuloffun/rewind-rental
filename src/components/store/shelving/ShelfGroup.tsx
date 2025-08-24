import { Euler, Quaternion, Vector3 } from "three";
import { MovieData } from "@/components/store/StoreScene.tsx";
import {
  InstancedShelfGroup,
  ShelfInstance,
} from "@/components/store/shelving/SimpleShelf.tsx";
import { SHELF_DIMENSIONS } from "@/constants.ts";

type ShelfGroupProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  onVideoClick: (movie: MovieData) => void;
  movies?: MovieData[];
  signText?: string;
};

const MOVIES_PER_SHELF = 20;
export function ShelfGroup({
  position,
  rotation,
  onVideoClick,
  movies,
  signText,
}: ShelfGroupProps) {
  if (!movies || movies.length === 0) return null;

  const shelfCount = Math.ceil(movies.length / MOVIES_PER_SHELF);
  const totalWidth = SHELF_DIMENSIONS.WIDTH * shelfCount;
  const centerOffset = -totalWidth / 2 + SHELF_DIMENSIONS.WIDTH / 2;

  const shelves: ShelfInstance[] = [];

  const groupRot = rotation ? new Euler(...rotation) : new Euler();
  const groupQuat = new Quaternion().setFromEuler(groupRot);

  for (let i = 0; i < shelfCount; i++) {
    const start = i * MOVIES_PER_SHELF;
    const end = start + MOVIES_PER_SHELF;
    const shelfMovies = movies.slice(start, end);

    // local offset (before group transform)
    const localOffset = new Vector3(
      centerOffset + SHELF_DIMENSIONS.WIDTH * i,
      0,
      0,
    );

    // rotate + translate into world space
    const worldPos = localOffset
      .clone()
      .applyQuaternion(groupQuat)
      .add(new Vector3(...position));

    // shelf rotation = group rotation + any shelf rotation (in your case just group rotation)
    const shelfRot = rotation ?? [0, 0, 0];

    shelves.push({
      position: worldPos.toArray(),
      rotation: shelfRot,
      color: "#290b44",
      videos: shelfMovies,
      signText,
      onVideoClick,
      idPrefix: `${position.join("-")}-${i}-`,
    });
  }

  return <InstancedShelfGroup shelves={shelves} />;
}
