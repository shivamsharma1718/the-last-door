/**
 * Game 07: THE MIRROR TRIAL - 3D Gameplay Coordinator
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Coordinates:
 * - 3D Arena rendering (TheMirrorTrialArena)
 * - First-person PlayerControls with octagonal chamber collision
 * - Proximity detection for mirrors, physical artifacts, and the central altar
 * - E-key interaction dispatch (open/close examination)
 * - Pointer-lock lifecycle management
 * - Position reset isolation
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { TheMirrorTrialArena, constrainMirrorTrialPosition } from './TheMirrorTrialArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheMirrorTrialProps } from './mirrorTrialTypes'
import {
  CHAMBER_WIDTH,
  CHAMBER_DEPTH,
  INITIAL_MIRROR_POS,
  INITIAL_MIRROR_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G07,
  ALTAR_DISTANCE_THRESHOLD_G07,
} from './mirrorTrialTypes'
import {
  MIRROR_DEFINITIONS,
  getNearestMirror,
  getNearestArtifact,
  isNearAltar,
  calculateHorizontalDistance,
} from './mirrorTrialLogic'
import {
  useMirrorTrialStore,
  mirrorTrialStore,
} from './theMirrorTrialStore'

export const TheMirrorTrialGame: React.FC<TheMirrorTrialProps> = ({
  onComplete,
}) => {
  const {
    status,
    examinedMirrorIds,
    proximity,
    altarUnlocked,
    resetCounter,
  } = useMirrorTrialStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const proximityRef = useRef(proximity)
  proximityRef.current = proximity

  // Position constraint preventing walking through walls, mirrors, altar, or pedestals
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainMirrorTrialPosition(proposed, current, radius)
    },
    []
  )

  // Activate Game 07 in store on mount and clean up on unmount
  useEffect(() => {
    mirrorTrialStore.setActive(true)
    mirrorTrialStore.initFreshRun()
    mirrorTrialStore.setOnComplete(onComplete)

    return () => {
      mirrorTrialStore.setActive(false)
    }
  }, [onComplete])

  // Release pointer lock cleanly when opening examination or on non-exploring states
  useEffect(() => {
    const isPlayerActive = status === 'exploring' || status === 'altar_ready'

    if (!isPlayerActive) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  // Continuous frame loop for proximity evaluation (mirrors, artifacts, altar)
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring' && statusRef.current !== 'altar_ready') {
      return
    }

    const px = camera.position.x
    const pz = camera.position.z

    // 1. Proximity to Central Altar
    const nearAltar = isNearAltar(px, pz, ALTAR_DISTANCE_THRESHOLD_G07)

    // 2. Proximity to Physical Artifacts
    const nearArtifact = getNearestArtifact(px, pz, INTERACTION_DISTANCE_THRESHOLD_G07)

    // 3. Proximity to Mirror Frames
    const nearMirror = getNearestMirror(px, pz, INTERACTION_DISTANCE_THRESHOLD_G07)

    // Find corresponding mirror definition for artifact if near artifact
    const mirrorForArtifact = nearArtifact
      ? MIRROR_DEFINITIONS.find((m) => m.artifact.id === nearArtifact.id) || null
      : null

    // Determine whether closer to artifact or mirror
    let isCloserToArtifact = false
    if (nearArtifact && nearMirror) {
      const distArtifact = calculateHorizontalDistance(
        px,
        pz,
        nearArtifact.position[0],
        nearArtifact.position[2]
      )
      const distMirror = calculateHorizontalDistance(
        px,
        pz,
        nearMirror.mirrorPosition[0],
        nearMirror.mirrorPosition[2]
      )
      isCloserToArtifact = distArtifact < distMirror
    } else if (nearArtifact) {
      isCloserToArtifact = true
    }

    mirrorTrialStore.updateProximity({
      nearAltar,
      nearArtifact,
      nearMirror,
      mirrorForArtifact,
      isCloserToArtifact,
    })
  })

  // Keyboard interaction for 'KeyE' and 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const curStatus = statusRef.current

      if (e.code === 'KeyE') {
        if (curStatus === 'exploring' || curStatus === 'altar_ready') {
          const prox = proximityRef.current

          // Priority 1: Central Altar Inscription
          if (prox.isNearAltar) {
            e.preventDefault()
            e.stopPropagation()
            mirrorTrialStore.openAltarExamination()
            return
          }

          // Priority 2: Mirror or Artifact Investigation
          if (prox.mirror) {
            e.preventDefault()
            e.stopPropagation()
            mirrorTrialStore.openExamination(prox.mirror.id)
            return
          }
        } else if (curStatus === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          mirrorTrialStore.closeExamination()
        }
      } else if (e.code === 'Escape') {
        if (curStatus === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          mirrorTrialStore.closeExamination()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isControlsEnabled = status === 'exploring' || status === 'altar_ready'
  const isMovementEnabled = status === 'exploring' || status === 'altar_ready'

  return (
    <>
      {/* 3D Arena Environment */}
      <TheMirrorTrialArena
        investigatedMirrorIds={Array.from(examinedMirrorIds)}
        altarUnlocked={altarUnlocked}
      />

      {/* First-person player controls constrained to octagonal gothic chamber */}
      <PlayerControls
        roomWidth={CHAMBER_WIDTH}
        roomDepth={CHAMBER_DEPTH}
        playerRadius={0.35}
        initialPosition={INITIAL_MIRROR_POS}
        initialLookAt={INITIAL_MIRROR_LOOK}
        enabled={isControlsEnabled}
        movementEnabled={isMovementEnabled}
        resetTrigger={resetCounter}
        constrainPosition={handleConstrainPosition}
      />
    </>
  )
}
