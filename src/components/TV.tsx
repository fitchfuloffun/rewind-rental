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
      if (!hasInteracted) {
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
  }, [hasInteracted]);

  useEffect(() => {
    if (!playlist.length || !screenRef.current || !hasInteracted) return;

    const video = document.createElement("video");
    videoRef.current = video;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.src = playlist[currentVideoIndex];

    // Create listener outside the event handler
    const listener = new AudioListener();
    camera.add(listener);

    // Wait for video metadata to load before creating texture
    video.addEventListener("loadedmetadata", () => {
      const videoTexture = new VideoTexture(video);
      videoTexture.wrapS = videoTexture.wrapT = 1000;
      videoTexture.needsUpdate = true;

      const screenMaterial = screenRef.current.material as MeshStandardMaterial;
      screenMaterial.map = videoTexture;
      screenMaterial.emissiveMap = videoTexture;
      screenMaterial.emissive.set(0xffffff);
      screenMaterial.emissiveIntensity = 0.4;
      screenMaterial.needsUpdate = true;

      const sound = new PositionalAudio(listener);
      sound.setMediaElementSource(video);
      sound.setRefDistance(5);
      sound.setRolloffFactor(2);
      sound.setDistanceModel("linear");
      sound.setDirectionalCone(90, 180, 0.1);
      sound.setVolume(volume);

      screenRef.current.add(sound);
      audioRef.current = sound;

      video
        .play()
        .then(() => {
          video.muted = false;
          sound.setVolume(volume);
        })
        .catch(console.warn);
    });

    video.addEventListener("ended", () => {
      setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
    });

    // Load the video
    video.load();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
        videoRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.disconnect();
        screenRef.current?.remove(audioRef.current);
        audioRef.current = null;
      }
      if (screenRef.current) {
        const material = screenRef.current.material as MeshStandardMaterial;
        material.map?.dispose();
        material.emissiveMap?.dispose();
        material.map = null;
        material.emissiveMap = null;
        material.needsUpdate = true;
      }
      camera.remove(listener);
    };
  }, [playlist, currentVideoIndex, hasInteracted, volume, camera]);

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
