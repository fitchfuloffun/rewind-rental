export function Lighting() {
  return (
    <>
      {/* Enhanced lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 0]} intensity={2} color="white" />
      <pointLight position={[-4, 3, -2]} intensity={1.5} color="white" />
      <pointLight position={[4, 3, -2]} intensity={1.5} color="white" />
      <pointLight position={[-4, 3, 2]} intensity={1.5} color="white" />
      <pointLight position={[4, 3, 2]} intensity={1.5} color="white" />
      
      {/* Store entrance lighting */}
      <pointLight position={[0, 2, 4]} intensity={1} color="#ffcd3c" />
      
      {/* Window light simulation */}
      <directionalLight
        position={[-10, 5, 0]}
        intensity={1}
        color="#ffffff"
      />
      <directionalLight
        position={[10, 5, 0]}
        intensity={1}
        color="#ffffff"
      />
    </>
  )
}