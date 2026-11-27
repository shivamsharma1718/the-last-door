/**
 * Game 10: THE FORGOTTEN GAME - Minimal Exploration UI & Area Detection Feedback
 * Theme: Psychological Horror, Memory Manipulation, Distorted History.
 *
 * Provides minimal, atmospheric exploration feedback:
 * - Unobtrusive location banner upon entering a distinct area.
 * - Displays canonical sector title and subtitle.
 * - Smooth fade-in, 2.8s display, and smooth 0.6s fade-out.
 * - Zero permanent HUD clutter, zero minimaps, zero waypoint arrows.
 * - Portals cleanly to document.body.
 */

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useForgottenGameStore } from './forgottenGameStore'
import { GAME10_AREAS } from './game10Types'
import type { Game10AreaId } from './game10Types'

export const TheForgottenGameUI: React.FC = () => {
  const { isActive, currentAreaId } = useForgottenGameStore()
  const [visibleAreaId, setVisibleAreaId] = useState<Game10AreaId | null>(null)
  const [isFading, setIsFading] = useState<boolean>(false)
  const timerRef = useRef<number | null>(null)
  const prevAreaRef = useRef<Game10AreaId | null>(null)

  useEffect(() => {
    if (!isActive) {
      setVisibleAreaId(null)
      prevAreaRef.current = null
      return
    }

    // Trigger subtle location feedback whenever the player crosses into a new distinct zone
    if (currentAreaId && currentAreaId !== prevAreaRef.current) {
      prevAreaRef.current = currentAreaId
      setVisibleAreaId(currentAreaId)
      setIsFading(false)

      if (timerRef.current) clearTimeout(timerRef.current)

      // Keep location label visible for 2.8s before fading out smoothly
      timerRef.current = window.setTimeout(() => {
        setIsFading(true)
        timerRef.current = window.setTimeout(() => {
          setVisibleAreaId(null)
          setIsFading(false)
        }, 600)
      }, 2800)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, currentAreaId])

  if (!isActive || !visibleAreaId || typeof document === 'undefined') {
    return null
  }

  const areaDef = GAME10_AREAS.find((a) => a.id === visibleAreaId)
  if (!areaDef) return null

  const bannerContent = (
    <div
      id="game10-location-banner"
      style={{
        position: 'fixed',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 24px',
        backgroundColor: 'rgba(2, 5, 11, 0.88)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '4px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 16px rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(8px)',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        textAlign: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: '#38bdf8',
          textTransform: 'uppercase',
          marginBottom: '4px',
          fontWeight: 700,
        }}
      >
        {areaDef.title}
      </div>
      <div
        style={{
          fontSize: '12px',
          letterSpacing: '0.08em',
          color: '#94a3b8',
        }}
      >
        {areaDef.subtitle}
      </div>
    </div>
  )

  return createPortal(bannerContent, document.body)
}
