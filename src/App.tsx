import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MovieData, StoreScene } from "@/components/store/StoreScene.tsx";
import { ControlsDisplay } from "@/components/ui/ControlsDisplay.tsx";
import { Crosshair } from "@/components/ui/Crosshair.tsx";
import { LoadingScreen } from "@/components/ui/LoadingScreen.tsx";
import { VideoMenu } from "@/components/video/VideoMenu.tsx";
import { STORE_DIMENSIONS } from "@/constants.ts";
import { CollisionProvider } from "@/providers/CollisionProvider.tsx";
import { CrosshairProvider } from "@/providers/CrosshairProvider.tsx";
import { DebugProvider } from "@/providers/DebugProvider.tsx";
import { fetchAllMovies } from "@/services/tmdbApi.ts";

const moviesBySection = await fetchAllMovies();

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<MovieData | null>(null);

  const handleVideoClick = (movieData: MovieData) => {
    setSelectedVideo(movieData);
  };

  const closeMenu = () => {
    setSelectedVideo(null);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{
            position: [0, 3, STORE_DIMENSIONS.HALF_DEPTH - 1],
            fov: 75,
          }}
          gl={{
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            antialias: true,
            alpha: false,
          }}
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
          <VideoMenu movie={selectedVideo} onClose={closeMenu} />
        )}

        <ControlsDisplay />
      </Suspense>
    </div>
  );
}
