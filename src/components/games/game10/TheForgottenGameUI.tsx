/**
 * Game 10: THE FORGOTTEN GAME - Exploration HUD & Investigation Modal
 * Theme: Psychological Horror, Memory Manipulation, Distorted History.
 *
 * Provides:
 * 1. Location banner upon entering a distinct sector (2.8s display with smooth fade).
 * 2. Contextual brutalist interaction prompt ([E] Investigate — <Name>) when near an object.
 * 3. Inspection response modal displaying memory telemetry, reports, and evidence hints.
 * 4. Clean portal rendering directly into document.body.
 */

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useForgottenGameStore, forgottenGameStore } from './forgottenGameStore'
import { GAME10_AREAS } from './game10Types'
import type { Game10AreaId } from './game10Types'

export const TheForgottenGameUI: React.FC = () => {
  const {
    isActive,
    currentAreaId,
    interactionStatus,
    proximity,
    inspectingObject,
  } = useForgottenGameStore()

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

  if (!isActive || typeof document === 'undefined') {
    return null
  }

  const areaDef = visibleAreaId ? GAME10_AREAS.find((a) => a.id === visibleAreaId) : null

  const handleClose = () => {
    forgottenGameStore.closeInspection()
  }

  const uiContent = (
    <>
      {/* 1. Sector Location Banner */}
      {visibleAreaId && areaDef && (
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
      )}

      {/* 2. Contextual Interaction Prompt */}
      {interactionStatus === 'exploring' && proximity.promptText && (
        <div
          id="game10-interaction-prompt"
          style={{
            position: 'fixed',
            bottom: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 920,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            backgroundColor: 'rgba(2, 6, 15, 0.92)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '4px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85), 0 0 16px rgba(56, 189, 248, 0.2)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'monospace',
            animation: 'pulse 2s infinite',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3px 8px',
              backgroundColor: '#38bdf8',
              color: '#020617',
              fontSize: '11px',
              fontWeight: 800,
              borderRadius: '2px',
              letterSpacing: '0.05em',
            }}
          >
            E
          </span>
          <span
            style={{
              color: '#f1f5f9',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Investigate — {proximity.targetName}
          </span>
          <span
            style={{
              color: '#64748b',
              fontSize: '11px',
              letterSpacing: '0.06em',
            }}
          >
            [{proximity.distance.toFixed(1)}m]
          </span>
        </div>
      )}

      {/* 3. Investigation Modal Dialog */}
      {interactionStatus === 'inspecting' && inspectingObject && (
        <div
          id="game10-inspection-overlay"
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(2, 6, 15, 0.84)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            id="game10-inspection-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '580px',
              backgroundColor: '#0a0f1d',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.95), 0 0 32px rgba(56, 189, 248, 0.15)',
              padding: '28px 32px',
              fontFamily: 'monospace',
              color: '#e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header / Sector classification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                TELEMETRY ARCHIVE // {inspectingObject.areaId.toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  fontFamily: 'monospace',
                }}
              >
                ✕
              </button>
            </div>

            {/* Object Title */}
            <div
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '0.06em',
                lineHeight: 1.3,
              }}
            >
              {inspectingObject.title}
            </div>

            {/* Accent divider */}
            <div
              style={{
                height: '1px',
                backgroundColor: 'rgba(56, 189, 248, 0.25)',
                margin: '2px 0',
              }}
            />

            {/* Description Body */}
            <div
              style={{
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: '#cbd5e1',
                whiteSpace: 'pre-line',
              }}
            >
              {inspectingObject.description}
            </div>

            {/* Optional Hint */}
            {inspectingObject.hint && (
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderLeft: '3px solid #38bdf8',
                  fontSize: '11.5px',
                  color: '#93c5fd',
                  letterSpacing: '0.04em',
                }}
              >
                HINT: {inspectingObject.hint}
              </div>
            )}

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '12px',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '10px 22px',
                  backgroundColor: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b'
                }}
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  return createPortal(uiContent, document.body)
}
