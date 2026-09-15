import React from 'react'
import { Room } from './Room'
import { Door } from './Door'
import { Lights } from './Lights'
import { PlayerControls } from './PlayerControls'

export const Scene: React.FC = () => {
  const roomWidth = 4.8
  const roomHeight = 3.4
  const roomDepth = 14

  return (
    <>
      {/* Psychological horror background & atmospheric fog */}
      <color attach="background" args={['#050609']} />
      <fog attach="fog" args={['#050609', 2, 14]} />

      {/* Lighting & Fixture */}
      <Lights />

      {/* Hallway / Room Geometry */}
      <Room width={roomWidth} height={roomHeight} depth={roomDepth} />

      {/* The Target Door at the far end */}
      <Door position={[0, 0, -6.94]} />

      {/* First-person Look & Movement Controls */}
      <PlayerControls roomWidth={roomWidth} roomDepth={roomDepth} />
    </>
  )
}
