import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/utils.js'

function Accordion({ className, ...props }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('divide-y divide-white/[0.08] border-t border-white/[0.08]', className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn(className)} {...props} />
}

function AccordionTrigger({ className, children, index, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group flex min-h-[76px] w-full items-center gap-5 py-5 text-left transition-opacity duration-300',
          'hover:opacity-100 focus-visible:opacity-100',
          '[&[data-state=closed]]:opacity-45 [&[data-state=open]]:opacity-100',
          className,
        )}
        {...props}
      >
        {index ? <span className="meta text-primary">{index}</span> : null}
        <span className="flex-1 font-display text-2xl font-semibold tracking-[-0.035em] text-gray-500 transition-colors group-hover:text-white group-data-[state=open]:text-white sm:text-3xl md:text-[2rem]">
          {children}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:border-primary group-hover:text-primary group-data-[state=open]:border-primary group-data-[state=open]:text-primary">
          <Plus size={16} className="group-data-[state=open]:hidden" />
          <Minus size={16} className="hidden group-data-[state=open]:block" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('max-w-2xl pb-7 pl-10 text-[0.95rem] leading-7 text-gray-400', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
