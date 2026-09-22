import React, { useState, useEffect } from 'react'

export interface Game04AlertProps {
  status: 'watcher_alert' | 'failing'
  onFailing: () => void
  onFailed: () => void
}

export const Game04Alert: React.FC<Game04AlertProps> = ({
  status,
  onFailing,
  onFailed,
}) => {
  const [failingStep, setFailingStep] = useState<number>(1)

  useEffect(() => {
    if (status === 'watcher_alert') {
      const t = setTimeout(() => {
        onFailing()
      }, 1800)
      return () => clearTimeout(t)
    } else if (status === 'failing') {
      const t1 = setTimeout(() => {
        setFailingStep(2)
      }, 1800)
      const t2 = setTimeout(() => {
        onFailed()
      }, 3400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [status, onFailing, onFailed])

  return (
    <div className="game04-alert-overlay" id="game04-alert-overlay-dom">
      <div className="game04-alert-glitch-pulse" />
      <div className="game04-transition-card">
        {status === 'watcher_alert' && (
          <p
            className="game04-transition-text game04-fade-in"
            style={{
              color: '#f8fafc',
              textShadow: '0 0 20px rgba(255,255,255,0.8)',
            }}
          >
            “IT NOTICED YOU.”
          </p>
        )}
        {status === 'failing' && failingStep === 1 && (
          <p
            className="game04-transition-text game04-fade-in"
            style={{
              color: '#38bdf8',
              fontWeight: 700,
              textShadow: '0 0 25px rgba(56, 189, 248, 0.7)',
            }}
          >
            “YOU LOOKED DIRECTLY AT IT.”
          </p>
        )}
        {status === 'failing' && failingStep === 2 && (
          <p
            className="game04-transition-text game04-fade-in"
            style={{ color: '#64748b', fontStyle: 'italic' }}
          >
            “The darkness closes in.”
          </p>
        )}
      </div>
    </div>
  )
}
