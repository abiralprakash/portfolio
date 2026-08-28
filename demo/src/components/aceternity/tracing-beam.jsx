import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

/**
 * Aceternity TracingBeam — a scroll-driven spine beside a chapter.
 * The fill climbs as the visitor reads, so process feels directed rather
 * than a static list.
 */
export function TracingBeam({ children, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 45%'],
  })
  const height = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 })

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute -left-3 top-2 hidden h-[calc(100%-0.5rem)] w-px md:block lg:-left-6"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-white/[0.08]" />
        {!reduce && (
          <motion.div
            style={{ scaleY: height }}
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-primary via-primary/70 to-transparent"
          />
        )}
        <span className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full border border-primary bg-background" />
      </div>
      {children}
    </div>
  )
}
