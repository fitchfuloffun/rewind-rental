import { useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  AudioListener,
  CylinderGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PositionalAudio,
  VideoTexture,
} from "three";

type TVProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  playlist?: string[];
  volume?: number;
};

export function TV({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  playlist = [],
  volume = 0.5,
}: TVProps) {
  const { camera } = useThree();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<PositionalAudio>(null);
  const screenRef = useRef<Mesh>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Create curved screen geometry with proper scaling
  const curvedScreen = useMemo(() => {
    const geometry = new CylinderGeometry(
      2, // radius
      2, // radius
      1.2, // height
      32, // segments
      1, // height segments
      false, // open-ended
      -Math.PI / 8, // start angle
      Math.PI / 4, // length angle
    );

    // Create transformation matrix
    const matrix = new Matrix4();
    matrix.makeRotationZ(Math.PI / 2);
    geometry.applyMatrix4(matrix);

    // Scale the geometry
    geometry.scale(0.8, 1, 0.4);

    return geometry;
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume;
        setHasInteracted(true);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hasInteracted, volume]);

  useEffect(() => {
    if (playlist.length > 0 && screenRef.current) {
      const video = document.createElement("video");
      video.src = playlist[currentVideoIndex];
      video.loop = false;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      video.load();

      // Create positional audio
      const listener = new AudioListener();
      camera.add(listener);

      const sound = new PositionalAudio(listener);
      sound.setMediaElementSource(video);
      sound.setRefDistance(5); // Distance at which the volume starts falling off
      sound.setRolloffFactor(2); // How quickly the sound fades with distance
      sound.setDistanceModel("linear"); // Linear falloff model
      sound.setDirectionalCone(90, 180, 0.1); // Directional cone parameters

      // Add sound to the TV mesh
      screenRef.current.add(sound);
      audioRef.current = sound;

      const videoTexture = new VideoTexture(video);
      const screenMaterial = screenRef.current.material as MeshStandardMaterial;
      screenMaterial.map = videoTexture;
      screenMaterial.emissiveMap = videoTexture;
      screenMaterial.emissive.set(0xffffff);
      screenMaterial.emissiveIntensity = 0.4;

      // Adjust texture wrapping for curved surface
      videoTexture.wrapS = videoTexture.wrapT = 1000;

      video.addEventListener("ended", () => {
        setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
      });

      const playVideo = async () => {
        try {
          await video.play();
          videoRef.current = video;
          if (hasInteracted) {
            video.muted = false;
            if (audioRef.current) {
              audioRef.current.setVolume(volume);
            }
          }
        } catch (error) {
          console.warn("Video playback failed:", error);
        }
      };
      playVideo();

      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          screenMaterial.map = null;
          screenMaterial.emissiveMap = null;
          screenMaterial.needsUpdate = true;
          videoTexture.dispose();
        }
      };
    }
  }, [playlist, currentVideoIndex, hasInteracted, volume, camera]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && videoRef.current && audioRef.current) {
        videoRef.current.muted = false;
        audioRef.current.setVolume(volume);
        setHasInteracted(true);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hasInteracted, volume]);

  return (
    <group position={position} rotation={rotation}>
      {/* TV Casing */}
      <mesh>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Curved Screen */}
      <mesh
        ref={screenRef}
        position={[0, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <primitive object={curvedScreen} />
        <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.2} />
      </mesh>

      {/* Screen Bezel */}
      <mesh position={[0, 0, 0.46]}>
        <boxGeometry args={[1.7, 1.3, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0.8, -0.5, 0.4]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Antenna */}
      <group position={[0.5, 0.8, -0.3]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      </group>
    </group>
  );
}
