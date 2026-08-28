import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

const PATHS = [
  'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
  'M-160 -200C-160 -200 -80 180 280 310C640 440 720 820 720 820',
  'M40 -220C40 -220 140 150 420 290C700 430 800 780 800 780',
  'M220 -180C220 -180 300 190 560 320C820 450 900 800 900 800',
  'M-240 40C-240 40 -160 320 200 430C560 540 640 820 640 820',
]

/**
 * Aceternity Background Beams — slow traveling paths behind a scene.
 * Hidden entirely when the visitor prefers reduced motion.
 */
export function BackgroundBeams({ className }) {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <svg className="absolute h-full w-full" viewBox="0 0 696 316" fill="none">
        {PATHS.map((d, i) => (
          <g key={d}>
            <path d={d} stroke="url(#lab-beam-static)" strokeOpacity="0.12" strokeWidth="0.6" />
            <path
              d={d}
              stroke={`url(#lab-beam-${i})`}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>
        ))}
        <defs>
          <linearGradient id="lab-beam-static" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00df8f" stopOpacity="0" />
            <stop offset="50%" stopColor="#00df8f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00df8f" stopOpacity="0" />
          </linearGradient>
          {PATHS.map((_, i) => (
            <linearGradient key={i} id={`lab-beam-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00df8f" stopOpacity="0" />
              <stop offset="50%" stopColor="#00df8f" stopOpacity="0.7">
                <animate
                  attributeName="offset"
                  values="0;1"
                  dur={`${7 + i * 1.4}s`}
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#00df8f" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
}
