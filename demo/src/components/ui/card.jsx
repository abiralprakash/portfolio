import { cn } from '../../lib/utils.js'

function Card({ className, ...props }) {
  return (
    <article
      data-slot="card"
      className={cn(
        'relative border-b border-white/[0.09] py-8 transition-colors duration-200 sm:min-h-[220px] sm:px-8',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn(className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        'font-display text-2xl font-semibold tracking-[-0.035em] text-white transition-colors duration-200 group-hover:text-primary group-focus:text-primary',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn('mt-3 max-w-lg text-[0.95rem] leading-7 text-gray-400', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription }
