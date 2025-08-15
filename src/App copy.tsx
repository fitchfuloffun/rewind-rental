import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, useTexture, Environment, PerspectiveCamera } from '@react-three/drei';

// Extend Three.js materials for custom shaders
extend({ OrbitControls });

// Movie data with categories
const movieData = {
  action: [
    { title: 'Terminator 2', color: '#ff4444' },
    { title: 'Die Hard', color: '#ff6666' },
    { title: 'Speed', color: '#ff2222' },
    { title: 'Top Gun', color: '#ff5555' },
    { title: 'Face/Off', color: '#ff3333' },
    { title: 'Mission Impossible', color: '#ff7777' }
  ],
  comedy: [
    { title: 'Dumb & Dumber', color: '#44ff44' },
    { title: 'Austin Powers', color: '#66ff66' },
    { title: 'The Mask', color: '#22ff22' },
    { title: 'Home Alone', color: '#55ff55' },
    { title: 'Wayne\'s World', color: '#33ff33' },
    { title: 'Big Lebowski', color: '#77ff77' }
  ],
  drama: [
    { title: 'Titanic', color: '#4444ff' },
    { title: 'Good Will Hunting', color: '#6666ff' },
    { title: 'Forrest Gump', color: '#2222ff' },
    { title: 'Shawshank Redemption', color: '#5555ff' },
    { title: 'Pulp Fiction', color: '#3333ff' },
    { title: 'Goodfellas', color: '#7777ff' }
  ],
  horror: [
    { title: 'Scream', color: '#444444' },
    { title: 'Friday 13th', color: '#333333' },
    { title: 'Halloween', color: '#222222' },
    { title: 'Silence of Lambs', color: '#555555' },
    { title: 'The Exorcist', color: '#666666' },
    { title: 'Nightmare on Elm St', color: '#777777' }
  ],
  romance: [
    { title: 'Pretty Woman', color: '#ff44ff' },
    { title: 'Ghost', color: '#ff66ff' },
    { title: 'Dirty Dancing', color: '#ff22ff' },
    { title: 'When Harry Met Sally', color: '#ff55ff' },
    { title: 'Sleepless in Seattle', color: '#ff33ff' },
    { title: 'You\'ve Got Mail', color: '#ff77ff' }
  ],
  scifi: [
    { title: 'Star Wars', color: '#44ffff' },
    { title: 'Jurassic Park', color: '#66ffff' },
    { title: 'The Matrix', color: '#22ffff' },
    { title: 'Men in Black', color: '#55ffff' },
    { title: 'Independence Day', color: '#33ffff' },
    { title: 'Blade Runner', color: '#77ffff' }
  ]
};

// Video spine component
function VideoSpine({ position, title, color, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.05 : 1);
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.15, 1.8, 0.05]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Box>
      <Text
        position={[0, 0, 0.03]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {title}
      </Text>
    </group>
  );
}

// Shelf component
function Shelf({ position, rotation, movies, onMovieClick }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Shelf structure */}
      <Box args={[4, 0.1, 0.3]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[4, 0.1, 0.3]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.1, 2, 0.3]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[0.1, 2, 0.3]} position={[2, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Video spines */}
      {movies.map((movie, index) => (
        <VideoSpine
          key={movie.title}
          position={[-1.8 + (index * 0.6), 0, 0.1]}
          title={movie.title}
          color={movie.color}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </group>
  );
}

// Store floor
function Floor() {
  return (
    <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <meshStandardMaterial 
        color="#2a2a2a" 
        roughness={0.8}
        metalness={0.1}
      />
    </Plane>
  );
}

// Store walls
function Walls() {
  return (
    <group>
      {/* Back wall */}
      <Plane args={[20, 10]} position={[0, 3, -10]}>
        <meshStandardMaterial color="#1a4c96" />
      </Plane>
      {/* Left wall */}
      <Plane args={[20, 10]} position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a4c96" />
      </Plane>
      {/* Right wall */}
      <Plane args={[20, 10]} position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a4c96" />
      </Plane>
    </group>
  );
}

// Blockbuster sign
function BlockbusterSign() {
  return (
    <group position={[0, 6, -9.5]}>
      <Box args={[6, 1, 0.2]}>
        <meshStandardMaterial color="#1e3c72" emissive="#1e3c72" emissiveIntensity={0.1} />
      </Box>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.4}
        color="#ffcd3c"
        anchorX="center"
        anchorY="middle"
        font="/fonts/bold.woff"
      >
        🎬 BLOCKBUSTER VIDEO 🎬
      </Text>
    </group>
  );
}

// New Releases display
function NewReleases() {
  const newMovies = [
    'The Matrix', 'Fight Club', 'American Beauty', 'Sixth Sense', 'Toy Story 2'
  ];

  return (
    <group position={[0, 0, -6]}>
      <Box args={[8, 2, 0.1]}>
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.2} />
      </Box>
      <Text
        position={[0, 0.5, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        📼 NEW RELEASES - $3.99 📼
      </Text>
      {newMovies.map((movie, index) => (
        <VideoSpine
          key={movie}
          position={[-3 + (index * 1.5), -0.5, 0.2]}
          title={movie}
          color="#ff4444"
          onClick={() => console.log(`Selected: ${movie}`)}
        />
      ))}
    </group>
  );
}

// Checkout counter
function CheckoutCounter() {
  return (
    <group position={[0, -1, 2]}>
      <Box args={[6, 0.8, 1.5]}>
        <meshStandardMaterial color="#444444" roughness={0.3} metalness={0.7} />
      </Box>
      <Text
        position={[0, 0.5, 0.8]}
        fontSize={0.2}
        color="#ffcd3c"
        anchorX="center"
        anchorY="middle"
      >
        Checkout Counter
      </Text>
    </group>
  );
}

// Late fee sign
function LateFeeSign() {
  return (
    <group position={[7, 2, -3]} rotation={[0, 0, -0.2]}>
      <Box args={[2, 1, 0.1]}>
        <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={0.1} />
      </Box>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Be Kind{'\n'}Rewind!
      </Text>
    </group>
  );
}

// Custom camera controller
function CameraController() {
  const { camera } = useThree();
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const speed = 0.1;
    if (keys.KeyW) camera.position.z -= speed;
    if (keys.KeyS) camera.position.z += speed;
    if (keys.KeyA) camera.position.x -= speed;
    if (keys.KeyD) camera.position.x += speed;
  });

  return null;
}

// Lighting setup
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 8, 0]} intensity={0.8} color="#ffcd3c" />
      <pointLight position={[-5, 4, -5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[5, 4, -5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 4, 5]} intensity={0.4} color="#4ecdc4" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffcd3c',
      fontSize: '24px',
      fontWeight: 'bold',
      zIndex: 1000
    }}>
      🎬 Loading Blockbuster... 📼
    </div>
  );
}

// Main store component
function BlockbusterStore() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentSection, setCurrentSection] = useState('entrance');

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    console.log(`Selected movie: ${movie.title}`);
  };

  return (
    <>
      <CameraController />
      <Lighting />
      
      {/* Store structure */}
      <Floor />
      <Walls />
      <BlockbusterSign />
      <NewReleases />
      <CheckoutCounter />
      <LateFeeSign />

      {/* Movie shelves arranged in aisles */}
      <Shelf
        position={[-6, 1, -3]}
        rotation={[0, 0, 0]}
        movies={movieData.action}
        onMovieClick={handleMovieClick}
      />
      <Shelf
        position={[-6, 1, 0]}
        rotation={[0, 0, 0]}
        movies={movieData.comedy}
        onMovieClick={handleMovieClick}
      />
      <Shelf
        position={[6, 1, -3]}
        rotation={[0, Math.PI, 0]}
        movies={movieData.drama}
        onMovieClick={handleMovieClick}
      />
      <Shelf
        position={[6, 1, 0]}
        rotation={[0, Math.PI, 0]}
        movies={movieData.romance}
        onMovieClick={handleMovieClick}
      />
      <Shelf
        position={[0, 1, 3]}
        rotation={[0, Math.PI / 2, 0]}
        movies={movieData.horror}
        onMovieClick={handleMovieClick}
      />
      <Shelf
        position={[3, 1, 3]}
        rotation={[0, Math.PI / 2, 0]}
        movies={movieData.scifi}
        onMovieClick={handleMovieClick}
      />

      {/* Interactive elements */}
      {selectedMovie && (
        <group position={[0, 4, 0]}>
          <Text
            fontSize={0.5}
            color="#ffcd3c"
            anchorX="center"
            anchorY="middle"
          >
            Selected: {selectedMovie.title}
          </Text>
        </group>
      )}
    </>
  );
}

// Controls UI
function ControlsUI() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      fontSize: '14px',
      textAlign: 'center',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        🎮 Controls
      </div>
      <div>
        Mouse: Look around | WASD: Move | Click movies to select
      </div>
    </div>
  );
}

// Main app component
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ position: [0, 2, 8], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          <BlockbusterStore />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>
      <ControlsUI />
    </div>
  );
}