import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

const badgeVariants = cva(
  'meta inline-flex items-center rounded-full px-2.5 py-1',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        live: 'text-[#00df8f]',
        scaling: 'text-sky-400',
        experiment: 'text-violet-400',
        building: 'text-yellow-400',
        muted: 'text-gray-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
