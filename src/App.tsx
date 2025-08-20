import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CubeTextureLoader, Scene } from "three";
import { ControlsDisplay } from "@/components/controls/ControlsDisplay.tsx";
import { Crosshair } from "@/components/controls/Crosshair.tsx";
import { StoreScene } from "@/components/store/StoreScene.tsx";
import { VideoMenu } from "@/components/video/VideoMenu.tsx";
import { STORE_DIMENSIONS } from "@/constants.ts";
import { CollisionProvider } from "@/providers/CollisionProvider.tsx";
import { CrosshairProvider } from "@/providers/CrosshairProvider.tsx";
import { DebugProvider } from "@/providers/DebugProvider.tsx";
import { TMDBMovieData, tmdbApi } from "@/services/tmdbApi.ts";
import { getAssetUrl } from "@/utils/asset.ts";
import { getImageUrl } from "@/utils/image.ts";

export type MovieData = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  price: number;
};

const popular = await Promise.all([
  tmdbApi.getPopularMovies(""),
  tmdbApi.getPopularMovies("page=2"),
]);

const cage = await tmdbApi.getCageMovieCredits();

const twilight = await tmdbApi.getMoviesByCollection(33514);
const trending = await Promise.all([
  tmdbApi.getTrendingMovies("page=1"),
  tmdbApi.getTrendingMovies("page=2"),
  tmdbApi.getTrendingMovies("page=3"),
]);

const cageMovies = cage.cast.map(
  (movie: TMDBMovieData, movieIndex: number) => ({
    id: `cage-${movieIndex}`,
    title: movie.title,
    description: movie.overview,
    cover: getImageUrl(movie.poster_path, "poster", "medium"),
    price: "Priceless",
  }),
);

const twilightMovies = twilight.parts.map(
  (movie: TMDBMovieData, movieIndex: number) => ({
    id: `cage-${movieIndex}`,
    title: movie.title,
    description: movie.overview,
    cover: getImageUrl(movie.poster_path, "poster", "medium"),
    price: "Where you been, loca?",
  }),
);

const trendingMovies = trending.map((response) =>
  response.results.map((movie: TMDBMovieData, movieIndex: number) => ({
    id: `trending-${movieIndex}`,
    title: movie.title,
    description: movie.overview,
    cover: getImageUrl(movie.poster_path, "poster", "medium") ?? "",
    price: 9.99,
  })),
);

const movies = popular.map((response, responseIndex: number) =>
  response.results.map((movie: TMDBMovieData, movieIndex: number) => ({
    id: `${responseIndex}${movieIndex}`,
    title: movie.title,
    description: movie.overview,
    cover: getImageUrl(movie.poster_path, "poster", "medium") ?? "",
    price: 9.99,
  })),
);

movies.push(cageMovies);
movies.push(twilightMovies);
movies.push(trendingMovies.flat());
export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<MovieData | null>(null);

  const handleVideoClick = (movieData: MovieData) => {
    setSelectedVideo(movieData);
  };

  const closeMenu = () => {
    setSelectedVideo(null);
  };

  const scene = new Scene();
  const loader = new CubeTextureLoader();
  loader.load(
    [
      getAssetUrl("/assets/textures/skybox/px.png"),
      getAssetUrl("/assets/textures/skybox/nx.png"),
      getAssetUrl("/assets/textures/skybox/py.png"),
      getAssetUrl("/assets/textures/skybox/ny.png"),
      getAssetUrl("/assets/textures/skybox/pz.png"),
      getAssetUrl("/assets/textures/skybox/nz.png"),
    ],
    (texture) => {
      scene.background = texture;
    },
  );

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas
        camera={{
          position: [0, 3, STORE_DIMENSIONS.HALF_DEPTH - 1],
          fov: 75,
        }}
        scene={scene}
      >
        <DebugProvider>
          <CollisionProvider>
            <CrosshairProvider>
              <StoreScene
                onVideoClick={handleVideoClick}
                disableControls={!!selectedVideo}
                movies={movies}
              />
            </CrosshairProvider>
          </CollisionProvider>
        </DebugProvider>
      </Canvas>
      <Crosshair />

      {selectedVideo && <VideoMenu movie={selectedVideo} onClose={closeMenu} />}
      {/* Controls display */}
      <ControlsDisplay />
    </div>
  );
}
