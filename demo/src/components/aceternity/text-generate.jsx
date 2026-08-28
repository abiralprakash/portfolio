import { useEffect, useRef } from 'react'
import { motion, stagger, useAnimate, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

/**
 * Aceternity-style text generate: words arrive in sequence once the line
 * enters view. Used for philosophy — a statement that should be read, not
 * dumped on screen.
 */
export function TextGenerate({ text, className, delay = 0.12 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const [scope, animate] = useAnimate()
  const words = String(text ?? '').split(' ')

  useEffect(() => {
    if (!inView || reduce) return undefined
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)', y: 0 },
      { duration: 0.42, delay: stagger(0.045, { startDelay: delay }), ease: [0.32, 0.72, 0, 1] },
    )
  }, [inView, reduce, animate, delay])

  return (
    <p ref={ref} className={cn(className)}>
      <span ref={scope} className="inline">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </span>
    </p>
  )
}
