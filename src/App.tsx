import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CubeTextureLoader, Scene } from "three";
import { StoreScene } from "@/components/StoreScene";
import { VideoMenu } from "@/components/VideoMenu";
import { ControlsDisplay } from "./components/ControlsDisplay";
import { Crosshair } from "./components/Crosshair";

export type MovieData = {
  title: string;
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
      "src/assets/textures/skybox/px.png",
      "src/assets/textures/skybox/nx.png",
      "src/assets/textures/skybox/py.png",
      "src/assets/textures/skybox/ny.png",
      "src/assets/textures/skybox/pz.png",
      "src/assets/textures/skybox/nz.png",
    ],
    (texture) => {
      scene.background = texture;
    },
  );

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }} scene={scene}>
        <StoreScene
          onVideoClick={handleVideoClick}
          disableControls={!!selectedVideo}
        />
      </Canvas>
      <Crosshair />

      {selectedVideo && <VideoMenu movie={selectedVideo} onClose={closeMenu} />}
      {/* Controls display */}
      <ControlsDisplay />
    </div>
  );
}
