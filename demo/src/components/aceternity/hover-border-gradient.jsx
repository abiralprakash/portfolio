import { cn } from '../../lib/utils.js'

/**
 * Aceternity HoverBorderGradient — a slow rotating border used only on the
 * Builder ID card so it feels like a live artifact, not a generic button.
 */
export function HoverBorderGradient({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn(
        'group relative overflow-hidden rounded-[1.15rem] p-px',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-40%] animate-border-spin bg-[conic-gradient(from_90deg,transparent_0%,#00df8f_18%,transparent_36%)] opacity-50 transition-opacity duration-500 group-hover:opacity-90"
      />
      <span className="relative z-10 block rounded-[1.1rem] bg-[#14181f]">{children}</span>
    </Tag>
  )
}
