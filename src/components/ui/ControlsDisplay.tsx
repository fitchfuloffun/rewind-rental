export function ControlsDisplay() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        color: "white",
        background: "rgba(0,0,0,0.7)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <div>Click to enable mouse look</div>
      <div>WASD to move, Mouse to look around</div>
      <div>Left Shift to sprint, Left Ctrl to toggle crouch</div>
      <div>B to switch on debug mode</div>
      <div>ESC to unlock mouse</div>
    </div>
  );
}
