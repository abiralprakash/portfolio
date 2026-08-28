import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_12px_40px_-18px_rgba(0,223,143,0.8)] hover:bg-[#18eca0]',
        outline:
          'border border-primary/25 text-primary hover:border-primary/50 hover:bg-primary/[0.06]',
        ghost: 'text-gray-300 hover:text-white',
        link: 'rounded-none px-1 text-sm font-medium text-gray-300 hover:text-white',
      },
      size: {
        default: 'min-h-12 px-7 py-3.5',
        sm: 'min-h-11 px-4 py-2 text-[0.68rem] uppercase tracking-[0.12em]',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
