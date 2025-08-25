import { PerformanceStats } from "@/contexts/DebugContext.ts";

export function PerformanceMonitor({
  performanceStats,
}: {
  performanceStats: PerformanceStats;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#00ff00",
        fontFamily: "monospace",
        fontSize: "14px",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 1000,
        minWidth: "200px",
        border: "1px solid #333",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
          color: "#ffffff",
          fontWeight: "bold",
        }}
      >
        Performance Monitor
      </div>

      <div
        style={{
          color:
            performanceStats.fps < 30
              ? "#ff4444"
              : performanceStats.fps < 60
                ? "#ffaa44"
                : "#44ff44",
        }}
      >
        FPS: {performanceStats.fps}
      </div>

      <div
        style={{
          color: performanceStats.renderCalls > 100 ? "#ffaa44" : "#00ff00",
        }}
      >
        Draw Calls: {performanceStats.renderCalls}
      </div>

      <div
        style={{
          color: performanceStats.triangles > 50000 ? "#ffaa44" : "#00ff00",
        }}
      >
        Triangles: {performanceStats.triangles.toLocaleString()}
      </div>

      <div
        style={{
          color: performanceStats.meshCount > 200 ? "#ffaa44" : "#00ff00",
        }}
      >
        Meshes: {performanceStats.meshCount}
      </div>

      <div>Geometries: {performanceStats.geometries}</div>
      <div>Textures: {performanceStats.textures}</div>
      <div>Shaders: {performanceStats.programs}</div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: "#888",
          borderTop: "1px solid #333",
          paddingTop: "5px",
        }}
      >
        Press P to toggle
      </div>
    </div>
  );
}
