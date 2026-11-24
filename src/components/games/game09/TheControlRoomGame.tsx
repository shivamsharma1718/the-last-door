/**
 * Game 09: THE CONTROL ROOM - 3D Gameplay Coordinator
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Coordinates:
 * - 3D Arena rendering (TheControlRoomArena) with all 8 areas and evidence props
 * - First-person PlayerControls with brutalist bunker collision constraints
 * - Spawns player at Area 1 Entry Checkpoint [0, 1.65, 10.0] facing North toward Dais [0, 1.65, 2.0]
 * - Safe pointer-lock lifecycle management
 */

import React, { useCallback, useRef } from 'react'
import { TheControlRoomArena, constrainControlRoomPosition } from './TheControlRoomArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheControlRoomProps } from './controlRoomTypes'
import {
  INITIAL_CONTROL_ROOM_POS,
  INITIAL_CONTROL_ROOM_LOOK,
  CONTROL_ROOM_TOTAL_WIDTH,
  CONTROL_ROOM_TOTAL_DEPTH,
} from './controlRoomTypes'
import { getAreaByPosition } from './controlRoomLogic'

export const TheControlRoomGame: React.FC<TheControlRoomProps> = () => {
  const currentAreaRef = useRef<string>('entry_airlock')

  // Sliding collision constraint preventing player from clipping walls or obstacles
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainControlRoomPosition(proposed, current, radius)
    },
    []
  )

  // Track player position to detect active area
  const handlePositionChange = useCallback((pos: { x: number; z: number }) => {
    const areaId = getAreaByPosition(pos.x, pos.z)
    if (areaId !== currentAreaRef.current) {
      currentAreaRef.current = areaId
    }
  }, [])

  return (
    <>
      {/* 3D Physical Brutalist Control Room Environment */}
      <TheControlRoomArena />

      {/* First-person Look & Movement Controls */}
      <PlayerControls
        roomWidth={CONTROL_ROOM_TOTAL_WIDTH}
        roomDepth={CONTROL_ROOM_TOTAL_DEPTH}
        initialPosition={INITIAL_CONTROL_ROOM_POS}
        initialLookAt={INITIAL_CONTROL_ROOM_LOOK}
        playerRadius={0.35}
        enabled={true}
        constrainPosition={handleConstrainPosition}
        onPositionChange={handlePositionChange}
      />
    </>
  )
}
