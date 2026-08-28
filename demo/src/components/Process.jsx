import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { PROCESS, IDENTITY } from '../data.js';
import { SectionHeader, Outline, EASE } from './ui.jsx';
import { Scene, SceneItem, MaskReveal } from './motion.jsx';

export default function Process() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="process" className="section-scene relative overflow-hidden bg-[#0d1116] py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeader
          index="03"
          label="How I Build"
          title={
            <>
              From messy problem to <Outline muted>working system</Outline>.
            </>
          }
        />

        {/* Philosophy statement */}
        <Scene className="mt-10 max-w-3xl">
          <MaskReveal
            as="p"
            contentClassName="font-display text-2xl font-medium leading-[1.3] tracking-[-0.025em] text-white/85 md:text-3xl"
          >
            {IDENTITY.philosophy}
          </MaskReveal>
        </Scene>

        <Scene
          stagger={0.06}
          className="mt-16 divide-y divide-white/[0.08] border-t border-white/[0.08]"
        >
          {PROCESS.map((stage, index) => {
            const isOpen = open === index;
            return (
              <SceneItem
                key={stage.n}
                type={index % 2 === 0 ? 'left' : 'right'}
                distance={14}
              >
                <button
                  type="button"
                  id={`process-trigger-${index}`}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  aria-controls={`process-panel-${index}`}
                  className={`group flex min-h-[76px] w-full items-center gap-5 py-5 text-left transition-opacity duration-300 ${
                    open >= 0 && !isOpen ? 'opacity-45 hover:opacity-100 focus-visible:opacity-100' : 'opacity-100'
                  }`}
                >
                  <span className="meta text-[#00df8f]">{stage.n}</span>
                  <span
                    className={`flex-1 font-display text-2xl font-semibold tracking-[-0.035em] transition-colors sm:text-3xl md:text-[2rem] ${
                      isOpen ? 'text-white' : 'text-gray-500 group-hover:text-white'
                    }`}
                  >
                    {stage.title}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? 'border-[#00df8f] text-[#00df8f]'
                        : 'border-white/15 text-white group-hover:border-[#00df8f] group-hover:text-[#00df8f]'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`process-panel-${index}`}
                      role="region"
                      aria-labelledby={`process-trigger-${index}`}
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pl-10 text-[0.95rem] leading-7 text-gray-400">
                        {stage.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SceneItem>
            );
          })}
        </Scene>
      </div>
    </section>
  );
}
