export function Crosshair() {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Horizontal line */}
      <div style={{
        position: 'absolute',
        width: '20px',
        height: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
      
      {/* Vertical line */}
      <div style={{
        position: 'absolute',
        width: '2px',
        height: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
      
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        width: '4px',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
  );
}