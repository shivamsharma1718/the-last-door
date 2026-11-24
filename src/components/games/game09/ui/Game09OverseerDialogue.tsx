/**
 * Game 09: THE CONTROL ROOM - Overseer AI Dialogue Transmission Overlay
 * Displays dynamic messages from the Overseer reflecting current trust protocol
 */

import React, { useEffect, useState } from 'react'
import type { OverseerDialogueState } from '../theControlRoomStore'

interface Game09OverseerDialogueProps {
  dialogue: OverseerDialogueState | null
  onDismiss?: () => void
}

export const Game09OverseerDialogue: React.FC<Game09OverseerDialogueProps> = ({
  dialogue,
  onDismiss,
}) => {
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (dialogue) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, 9000)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [dialogue, onDismiss])

  if (!dialogue || !visible) return null

  const isCollaborative = dialogue.protocol.includes('COLLABORATIVE')
  const isAdversarial = dialogue.protocol.includes('ADVERSARIAL')

  const tierClass = isCollaborative
    ? 'protocol-collaborative'
    : isAdversarial
    ? 'protocol-adversarial'
    : 'protocol-analytical'

  return (
    <aside
      className={`game09-dialogue-banner ${tierClass}`}
      id="game09-overseer-dialogue"
      aria-label="Overseer Broadcast"
    >
      <div className="game09-dialogue-header">
        <div className="game09-dialogue-waveform">
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
        </div>
        <span className="game09-dialogue-speaker">{dialogue.speaker}</span>
        <span className="game09-dialogue-tag">{dialogue.protocol}</span>
        <button
          type="button"
          className="game09-dialogue-close"
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          aria-label="Close message"
        >
          ×
        </button>
      </div>
      <p className="game09-dialogue-message">{dialogue.message}</p>
    </aside>
  )
}
