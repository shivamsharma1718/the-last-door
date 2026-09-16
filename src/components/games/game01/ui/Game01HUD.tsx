import type { LightPhase } from '../redLightTypes'

export interface Game01HUDProps {
  phase: LightPhase
  warningCount: number
  movementWarning: boolean
  distanceToExit: number
}

export const Game01HUD: React.FC<Game01HUDProps> = ({
  phase,
  warningCount,
  movementWarning,
  distanceToExit,
}) => {
  const isGreen = phase === 'GREEN'

  return (
    <div className="game01-hud" id="game01-hud-dom">
      <div className="game01-header">
        <span className="game01-title">GAME 01 • RED LIGHT, BLACK SILENCE</span>
        <div className={`game01-phase-badge ${isGreen ? 'green-phase' : 'red-phase'}`}>
          <span className="phase-dot" />
          {isGreen ? 'GREEN LIGHT — MOVE' : 'RED LIGHT — STOP'}
        </div>
      </div>

      {movementWarning && (
        <div className="movement-warning-alert">
          ⚠️ MOVEMENT DETECTED! SOMETHING IS WATCHING!
        </div>
      )}

      <div className="game01-bottom-info">
        <div className="game01-stat">
          <span className="stat-label">WARNINGS:</span>
          <span className={`stat-value ${warningCount > 0 ? 'has-warnings' : ''}`}>
            {warningCount}
          </span>
        </div>

        <div className="game01-objective">
          {distanceToExit <= 5 ? (
            <span className="game01-exit-prompt">🚪 [ EXIT REACHABLE ]</span>
          ) : (
            'Reach the exit. Stop when the light turns red.'
          )}
        </div>

        <div className="game01-stat">
          <span className="stat-label">DISTANCE:</span>
          <span className="stat-value">{distanceToExit}m</span>
        </div>
      </div>
    </div>
  )
}
