import { cn } from '../../lib/utils.js'

/**
 * Aceternity moving border — a traveling highlight around a live surface.
 * Used on the active system so the selected product feels powered on.
 */
export function MovingBorder({ className, children, rx = 16 }) {
  return (
    <div className={cn('relative overflow-hidden p-px', className)} style={{ borderRadius: rx }}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-60%] animate-border-spin bg-[conic-gradient(from_180deg,transparent_0%,#00df8f_12%,transparent_28%)] opacity-70"
      />
      <div className="relative z-10 h-full overflow-hidden bg-[#10151b]" style={{ borderRadius: rx - 1 }}>
        {children}
      </div>
    </div>
  )
}
