import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useDebug } from "@/hooks/useDebug.ts";

export function PerformanceTracker() {
  const { showPerformance, setPerformanceStats } = useDebug();
  const { gl, scene } = useThree();

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);

  useFrame(() => {
    if (!showPerformance) return;

    frameCount.current++;
    const now = performance.now();
    const deltaTime = now - lastTime.current;

    // Calculate FPS
    const currentFPS = 1000 / (deltaTime || 1);
    fpsHistory.current.push(currentFPS);

    if (fpsHistory.current.length > 60) {
      fpsHistory.current.shift();
    }

    // Update stats every 30 frames
    if (frameCount.current % 30 === 0) {
      const avgFPS =
        fpsHistory.current.reduce((a, b) => a + b, 0) /
        fpsHistory.current.length;
      const info = gl.info;

      let meshCount = 0;
      scene.traverse((child) => {
        if (child.type === "Mesh") meshCount++;
      });
      setPerformanceStats({
        fps: Math.round(avgFPS),
        renderCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        meshCount,
      });
    }

    lastTime.current = now;
  });

  // This component only tracks performance, doesn't render anything
  return null;
}
