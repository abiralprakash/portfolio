import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

/**
 * Aceternity FlipWords — cycles CMS-authored labels in place.
 * One word on screen at a time so the hero stays a directed line, not a ticker.
 */
export function FlipWords({ words = [], className, interval = 2200 }) {
  const reduce = useReducedMotion()
  const list = words.filter(Boolean)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || list.length < 2) return undefined
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % list.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [interval, list.length, reduce])

  const word = list[index] ?? list[0] ?? ''

  if (reduce || list.length < 2) {
    return <span className={cn('text-primary', className)}>{word}</span>
  }

  return (
    <span className={cn('relative inline-flex min-h-[1.1em] overflow-hidden', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ y: '70%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
          className="inline-block text-primary"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
