import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  AudioListener,
  Color,
  CylinderGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PositionalAudio,
  VideoTexture,
} from "three";
import { useCrosshair } from "@/hooks/useCrosshair.ts";
import { getAssetUrl } from "@/utils/asset";

type TVProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  playlist?: string[];
  volume?: number;
  defaultMuted?: boolean;
};

export function TV({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  playlist = [],
  volume = 0.5,
  defaultMuted,
}: TVProps) {
  const { camera } = useThree();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<PositionalAudio>(null);
  const screenRef = useRef<Mesh>(null);
  const meshRef = useRef<Mesh>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(defaultMuted ?? false);
  const muteTexture = useTexture(getAssetUrl("/assets/textures/mute.png"));
  const { hoveredObject, registerObject, unregisterObject } = useCrosshair();

  const hovered = hoveredObject === meshRef.current;
  const material = useMemo(() => {
    return new MeshStandardMaterial({ color: "#1a1a1a" });
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const id = "tv";
      registerObject(meshRef.current, id);

      return () => unregisterObject(id);
    }
  }, [registerObject, unregisterObject]);

  // Update emissive properties when hover state changes
  useEffect(() => {
    material.emissive = new Color("#ffffff");
    material.emissiveIntensity = hovered ? 0.1 : 0;
    material.needsUpdate = true;
  }, [hovered, material]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (hovered && document.pointerLockElement) {
        event.preventDefault();
        event.stopPropagation();
        setIsMuted(!isMuted);
      }
    };

    if (hovered) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [hovered, isMuted]);

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

  // Video setup effect - capture initial mute state to avoid dependency
  useEffect(() => {
    if (!playlist.length || !screenRef.current || !hasInteracted) return;

    // Capture the current mute state at the time of video creation
    const initialMuteState = isMuted;

    const video = document.createElement("video");
    videoRef.current = video;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.muted = initialMuteState; // Set initial mute state
    video.src = playlist[currentVideoIndex];

    const listener = new AudioListener();
    camera.add(listener);

    video.addEventListener("loadedmetadata", () => {
      if (!screenRef.current) return;

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
      sound.setVolume(initialMuteState ? 0 : volume); // Set initial volume based on mute state

      screenRef.current.add(sound);
      audioRef.current = sound;

      video
        .play()
        .then(() => {
          video.muted = initialMuteState;
          sound.setVolume(initialMuteState ? 0 : volume);
        })
        .catch(console.warn);
    });

    video.addEventListener("ended", () => {
      setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
    });

    // Load the video
    video.load();

    return () => {
      const { current: screenRefCurrent } = screenRef;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
        videoRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.disconnect();
        screenRefCurrent?.remove(audioRef.current);
        audioRef.current = null;
      }
      if (screenRefCurrent) {
        const material = screenRefCurrent.material as MeshStandardMaterial;
        material.map?.dispose();
        material.emissiveMap?.dispose();
        material.map = null;
        material.emissiveMap = null;
        material.needsUpdate = true;
      }
      camera.remove(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentVideoIndex, hasInteracted, volume, camera]);

  // Separate effect to handle mute/unmute without restarting video
  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      videoRef.current.muted = isMuted;
      audioRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [isMuted, volume]);

  return (
    <group position={position} rotation={rotation}>
      {/* TV Casing */}
      <mesh ref={meshRef} material={material}>
        <boxGeometry args={[2, 1.5, 1.5]} />
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

      {isMuted && (
        <mesh position={[0.5, -0.3, 0.79]} scale={[0.2, 0.2, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={muteTexture} color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}
