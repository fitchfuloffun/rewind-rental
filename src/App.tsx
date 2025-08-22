import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CubeTextureLoader, Scene } from "three";
import { ControlsDisplay } from "@/components/controls/ControlsDisplay.tsx";
import { Crosshair } from "@/components/controls/Crosshair.tsx";
import { MovieData, StoreScene } from "@/components/store/StoreScene.tsx";
import { VideoMenu } from "@/components/video/VideoMenu.tsx";
import { STORE_DIMENSIONS } from "@/constants.ts";
import { CollisionProvider } from "@/providers/CollisionProvider.tsx";
import { CrosshairProvider } from "@/providers/CrosshairProvider.tsx";
import { DebugProvider } from "@/providers/DebugProvider.tsx";
import { fetchAllMovies } from "@/services/tmdbApi.ts";
import { getAssetUrl } from "@/utils/asset.ts";

const moviesBySection = await fetchAllMovies();

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
                moviesBySection={moviesBySection}
              />
            </CrosshairProvider>
          </CollisionProvider>
        </DebugProvider>
      </Canvas>
      <Crosshair />

      {selectedVideo && (
        <Suspense>
          <VideoMenu movie={selectedVideo} onClose={closeMenu} />
        </Suspense>
      )}
      {/* Controls display */}
      <ControlsDisplay />
    </div>
  );
}
