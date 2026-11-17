/**
 * Game 07: THE MIRROR TRIAL - 3D Gameplay Coordinator
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Coordinates:
 * - 3D Arena rendering (TheMirrorTrialArena)
 * - First-person PlayerControls with octagonal chamber collision
 * - Proximity detection for mirrors, physical artifacts, and the central altar
 * - E-key interaction dispatch (open/close examination, altar verdict)
 * - Camera focus interpolation during the failure horror sequence
 * - Pointer-lock lifecycle management
 * - Position reset isolation
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
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
    selectedVerdict,
    failedMirrorId,
    resetCounter,
  } = useMirrorTrialStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const proximityRef = useRef(proximity)
  proximityRef.current = proximity

  const altarUnlockedRef = useRef(altarUnlocked)
  altarUnlockedRef.current = altarUnlocked

  const failedMirrorIdRef = useRef(failedMirrorId)
  failedMirrorIdRef.current = failedMirrorId

  // Pre-allocated vectors & matrices for smooth camera look-at during failure sequence
  const failedTargetVec = useMemo(() => new THREE.Vector3(), [])
  const lookMatrix = useMemo(() => new THREE.Matrix4(), [])
  const targetQuat = useMemo(() => new THREE.Quaternion(), [])

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

  // Release pointer lock cleanly when opening examination, verdict, or cinematic states
  useEffect(() => {
    const isPlayerActive = status === 'exploring' || status === 'altar_ready'

    if (!isPlayerActive) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  // Continuous frame loop for camera cinematic tracking and proximity evaluation
  useFrame(({ camera }) => {
    // 1. Failure cinematic: Smoothly focus camera on the reacting deceptive mirror
    if (statusRef.current === 'failure_cinematic') {
      const failedId = failedMirrorIdRef.current
      if (failedId) {
        const mirrorDef = MIRROR_DEFINITIONS.find((m) => m.id === failedId)
        if (mirrorDef) {
          failedTargetVec.set(...mirrorDef.mirrorPosition)
          lookMatrix.lookAt(camera.position, failedTargetVec, camera.up)
          targetQuat.setFromRotationMatrix(lookMatrix)
          camera.quaternion.slerp(targetQuat, 0.08)
        }
      }
      return
    }

    if (statusRef.current !== 'exploring' && statusRef.current !== 'altar_ready') {
      return
    }

    const px = camera.position.x
    const pz = camera.position.z

    // 2. Proximity to Central Altar
    const nearAltar = isNearAltar(px, pz, ALTAR_DISTANCE_THRESHOLD_G07)

    // 3. Proximity to Physical Artifacts
    const nearArtifact = getNearestArtifact(px, pz, INTERACTION_DISTANCE_THRESHOLD_G07)

    // 4. Proximity to Mirror Frames
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

          // Priority 1: Central Altar Inscription / Verdict
          if (prox.isNearAltar) {
            e.preventDefault()
            e.stopPropagation()
            if (altarUnlockedRef.current) {
              mirrorTrialStore.openAltarVerdict()
            } else {
              mirrorTrialStore.openAltarExamination()
            }
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
        } else if (curStatus === 'altar_verdict') {
          e.preventDefault()
          e.stopPropagation()
          mirrorTrialStore.closeAltarVerdict()
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
        status={status}
        failedMirrorId={failedMirrorId}
        selectedVerdict={selectedVerdict}
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
