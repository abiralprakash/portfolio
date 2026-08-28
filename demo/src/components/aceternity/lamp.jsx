import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

/**
 * Aceternity Lamp — a cone of light over the bench.
 * Atmosphere for the Now chapter; disabled when motion is reduced.
 */
export function Lamp({ className }) {
  const reduce = useReducedMotion()

  return (
    <div
      className={cn('pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div
        className={`mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent ${
          reduce ? 'opacity-40' : 'animate-lamp-line'
        }`}
      />
      <div
        className={`mx-auto -mt-px h-56 w-[min(42rem,90%)] bg-[radial-gradient(ellipse_at_top,rgba(0,223,143,0.18),transparent_70%)] ${
          reduce ? '' : 'animate-lamp-glow'
        }`}
      />
    </div>
  )
}
