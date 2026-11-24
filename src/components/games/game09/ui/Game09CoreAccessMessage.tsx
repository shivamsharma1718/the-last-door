/**
 * Game 09: THE CONTROL ROOM - Master Core Access Banner
 * Broadcast banner displayed when 5 of 6 directives have been verified.
 */

import React from 'react'

interface Game09CoreAccessMessageProps {
  onDismiss: () => void
}

export const Game09CoreAccessMessage: React.FC<Game09CoreAccessMessageProps> = ({
  onDismiss,
}) => {
  return (
    <div
      className="game09-core-access-banner"
      id="game09-core-access-alert"
      role="alert"
    >
      <div className="core-banner-icon">⚡</div>
      <div className="core-banner-content">
        <span className="core-banner-title">MASTER CORE ACCESS AVAILABLE</span>
        <p className="core-banner-sub">
          Required directive telemetry verified. The Overseer Master Core console is now active at Sector 07.
        </p>
      </div>
      <button
        type="button"
        className="core-banner-dismiss"
        onClick={onDismiss}
      >
        ACKNOWLEDGE
      </button>
    </div>
  )
}
