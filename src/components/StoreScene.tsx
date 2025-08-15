import { useState } from 'react';
import { StoreSign } from './StoreSign';
import { FirstPersonControls } from './FirstPersonControls';
import { Floor } from './Floor';
import { Lighting } from './Lighting';
import { SimpleShelf } from './SimpleShelf';
import { StoreStructure } from './StoreStructure';
import { Video } from './Video';
import { VideoMenu } from './VideoMenu';
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

// Main scene component
export function StoreScene() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const handleVideoClick = (movieData) => {
    setSelectedVideo(movieData);
  };
  
  const closeMenu = () => {
    setSelectedVideo(null);
  };

  const texture = useLoader(TextureLoader, "src/assets/textures/video.png")
  
  return (
    <>
      <FirstPersonControls />
      {/* Video menu overlay */}
      {selectedVideo && (
        <VideoMenu 
          movie={selectedVideo}
          onClose={closeMenu}
          position={[0, 2, 2]} // In front of camera
        />
      )}

      <Video 
        texture={texture} 
        position={[0,1,0]}
        movieData={{title: "Dungeons & Dragons: Honor Among Thieves", price: 3.99}}
        onVideoClick={handleVideoClick}
      />

      <Lighting/>

      {/* Floor and structure */}
      <Floor />
      <StoreStructure />

      {/* Simple shelves to represent the store */}
      <SimpleShelf position={[-4, 1.5, -2]} rotation={[0, Math.PI/2, 0]} color="#290b44" />
      <SimpleShelf position={[4, 1.5, -2]} rotation={[0, Math.PI/2, 0]} color="#290b44" />
      <SimpleShelf position={[-4, 1.5, 2]} rotation={[0, Math.PI/2, 0]} color="#290b44" />
      <SimpleShelf position={[4, 1.5, 2]} rotation={[0, Math.PI/2, 0]} color="#290b44" />

      {/* Center display */}
      <StoreSign />
    </>
  );
}
