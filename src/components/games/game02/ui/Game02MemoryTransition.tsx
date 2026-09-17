import React, { useState, useEffect } from 'react'

export interface Game02MemoryTransitionProps {
  onComplete: () => void
}

export const Game02MemoryTransition: React.FC<Game02MemoryTransitionProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    // Sequence timer triggers
    const timer1 = setTimeout(() => {
      setStep(2)
    }, 2800)

    const timer2 = setTimeout(() => {
      setStep(3)
    }, 5800)

    const timer3 = setTimeout(() => {
      onComplete()
    }, 8800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div
      className="game02-memory-transition-overlay"
      id="game02-memory-transition-dom"
    >
      <div className="game02-transition-card">
        {step === 1 && (
          <p className="game02-transition-text game02-fade-in">
            “You have seen five lives.”
          </p>
        )}
        {step === 2 && (
          <p className="game02-transition-text game02-fade-in">
            “Only one of them was yours.”
          </p>
        )}
        {step === 3 && (
          <p className="game02-transition-text game02-transition-highlight game02-fade-in">
            “Remember.”
          </p>
        )}
      </div>
    </div>
  )
}
