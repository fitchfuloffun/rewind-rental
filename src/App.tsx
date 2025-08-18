import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CubeTextureLoader, Scene } from "three";
import { StoreScene } from "@/components/StoreScene";
import { VideoMenu } from "@/components/VideoMenu";
import { CollisionProvider } from "@/providers/CollisionProvider.tsx";
import { CrosshairProvider } from "@/providers/CrosshairProvider.tsx";
import { DebugProvider } from "@/providers/DebugProvider.tsx";
import { ControlsDisplay } from "./components/ControlsDisplay";
import { Crosshair } from "./components/Crosshair";

export type MovieData = {
  id: number;
  title: string;
  cover: string;
  price: number;
};

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
      "/assets/textures/skybox/px.png",
      "/assets/textures/skybox/nx.png",
      "/assets/textures/skybox/py.png",
      "/assets/textures/skybox/ny.png",
      "/assets/textures/skybox/pz.png",
      "/assets/textures/skybox/nz.png",
    ],
    (texture) => {
      scene.background = texture;
    },
  );

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }} scene={scene}>
        <DebugProvider>
          <CollisionProvider>
            <CrosshairProvider>
              <StoreScene
                onVideoClick={handleVideoClick}
                disableControls={!!selectedVideo}
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
