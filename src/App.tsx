import { Canvas } from '@react-three/fiber';
import { StoreScene } from './components/StoreScene';
import { ControlsDisplay } from './components/ControlsDisplay';
import { Crosshair } from './components/Crosshair';
import { CubeTextureLoader, Scene } from "three";

export default function App() {
  const scene = new Scene()
  const loader = new CubeTextureLoader();
  loader.load([
    'src/assets/textures/skybox/px.png',
    'src/assets/textures/skybox/nx.png',
    'src/assets/textures/skybox/py.png',
    'src/assets/textures/skybox/ny.png',
    'src/assets/textures/skybox/pz.png',
    'src/assets/textures/skybox/nz.png',
  ], (texture) => {
    scene.background = texture;
  })
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }} scene={scene}>
        <StoreScene />
      </Canvas>
      <Crosshair />
      
      {/* Controls display */}
      <ControlsDisplay />
    </div>
  );
}