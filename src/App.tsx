import { Canvas } from '@react-three/fiber'
import { Scene } from './components/canvas/Scene'
import './App.css'

function App() {
  return (
    <div className="game-container">
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{
            fov: 70,
            position: [0, 1.65, 5.2],
            near: 0.1,
            far: 40,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Atmospheric UI Overlay */}
      <div className="hud-overlay">
        <header className="game-title">The Last Door</header>
        <div className="crosshair" />
        <footer className="instructions">
          Click to look • WASD to move • SHIFT to sprint • ESC to release
        </footer>
      </div>
    </div>
  )
}

export default App
