import { Canvas } from '@react-three/fiber';
import { StoreScene } from './components/StoreScene';
import { ControlsDisplay } from './components/ControlsDisplay';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <StoreScene />
      </Canvas>
      
      {/* Controls display */}
      <ControlsDisplay />
    </div>
  );
}