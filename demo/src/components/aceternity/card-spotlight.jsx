import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

/**
 * Aceternity card spotlight — a cursor-following wash of accent light.
 * Pointer-only; keyboard focus gets a quieter static edge instead.
 */
export function CardSpotlight({ className, children, ...props }) {
  const reduce = useReducedMotion()
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false })

  const onMove = useCallback(
    (event) => {
      if (reduce) return
      const rect = event.currentTarget.getBoundingClientRect()
      setSpot({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        on: true,
      })
    },
    [reduce],
  )

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
      className={cn('group relative overflow-hidden', className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          background: spot.on
            ? `radial-gradient(420px circle at ${spot.x}px ${spot.y}px, rgba(0,223,143,0.14), transparent 55%)`
            : 'radial-gradient(420px circle at 20% 0%, rgba(0,223,143,0.08), transparent 50%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
