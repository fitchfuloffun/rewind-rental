import { STORE_DIMENSIONS } from "../constants";
import { Downlight } from "./Downlight";

// Usage:
function StoreLighting() {
  const downlightPositions = [
    // [0, 0],
    [-4, -6],
    [-4, 0],
    [-4, 6],
    [4, -6],
    [4, 0],
    [4, 6],
  ]

  return (
    <group>
      {downlightPositions.map((position, index) => (
        <Downlight key={`downlight-${index}`} position={position} intensity={30} color="#33e0ff" />
      ))}
    </group>
  );
}


export function Lighting() {
  const { DEPTH, HEIGHT, HALF_WIDTH, HALF_DEPTH } = STORE_DIMENSIONS

  
  return (
    <>
      {/* Enhanced lighting */}
      <ambientLight intensity={0.8} />
      <StoreLighting />
      
      {/* Store entrance lighting */}
      <pointLight position={[0, 1, HALF_DEPTH+1]} intensity={100} color="#ffcd3c" />
      
      {/* Window light simulation */}
      <directionalLight
        position={[-HALF_WIDTH - 0.01, HEIGHT, -DEPTH * 0.167]}
        intensity={1}
        color="#ffcd3c"
      />
      <directionalLight
        position={[10, 5, 0]}
        intensity={1}
        color="#ffffff"
      />
    </>
  )
}