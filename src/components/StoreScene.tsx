import { StoreSign } from './StoreSign';
import { FirstPersonControls } from './FirstPersonControls';
import { Floor } from './Floor';
import { Lighting } from './Lighting';
import { SimpleShelf } from './SimpleShelf';
import { StoreStructure } from './StoreStructure';

// Main scene component
export function StoreScene() {
  return (
    <>
      <FirstPersonControls />

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
