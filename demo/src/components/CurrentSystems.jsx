import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SYSTEMS } from '../content/index.js';
import { SectionHeader, StatusDot, STATE_STYLES, EASE } from './ui.jsx';
import { Scene, SceneItem } from './motion.jsx';

const STORY_STEPS = [
  { key: 'problem', label: 'Problem' },
  { key: 'system', label: 'System' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'outcome', label: 'Outcome' },
];

export default function CurrentSystems() {
  const [activeId, setActiveId] = useState(SYSTEMS[0].id);
  const [direction, setDirection] = useState(1);
  const registryRef = useRef(null);
  const reduce = useReducedMotion();
  const activeIndex = SYSTEMS.findIndex((system) => system.id === activeId);
  const active = SYSTEMS[activeIndex] ?? SYSTEMS[0];
  const isExternal = active.link.startsWith('http');

  const activate = (id, focus = false) => {
    const nextIndex = SYSTEMS.findIndex((system) => system.id === id);
    if (nextIndex !== activeIndex) setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveId(id);
    if (focus) {
      requestAnimationFrame(() => {
        registryRef.current
          ?.querySelector(`[data-system-id="${id}"]`)
          ?.focus({ preventScroll: true });
      });
    }
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => {
        const detail = document.getElementById('active-system');
        if (!detail) return;
        const rect = detail.getBoundingClientRect();
        const mostlyOffscreen = rect.top > window.innerHeight * 0.72 || rect.bottom < 80;
        if (mostlyOffscreen) {
          detail.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }
  };

  const onKeyNav = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % SYSTEMS.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + SYSTEMS.length) % SYSTEMS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = SYSTEMS.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activate(SYSTEMS[nextIndex].id, true);
    }
  };

  return (
    <section id="systems" className="section-scene relative bg-[#0d1116] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end md:mb-16">
          <SectionHeader
            index="02"
            label="Current Systems"
            title="Products, running as systems."
            intro="Real products designed, built, and shipped. Select a system to inspect the problem it solves and how it works."
          />
          <span className="meta shrink-0 text-gray-600">
            {String(SYSTEMS.length).padStart(2, '0')} systems
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <Scene
            ref={registryRef}
            role="listbox"
            aria-label="Product systems"
            aria-activedescendant={`system-option-${active.id}`}
            stagger={0.055}
            className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 lg:sticky lg:top-28 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {SYSTEMS.map((system, index) => {
              const isActive = system.id === activeId;
              const state = STATE_STYLES[system.status];

              return (
                <SceneItem key={system.id} type={index % 2 === 0 ? 'left' : 'lift'} distance={16}>
                  <motion.button
                    id={`system-option-${system.id}`}
                    data-system-id={system.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => activate(system.id)}
                    onKeyDown={(event) => onKeyNav(event, index)}
                    className={`group relative min-h-[88px] w-full min-w-[238px] snap-start overflow-hidden rounded-xl border px-4 py-4 text-left transition-[border-color,background-color,opacity] duration-200 lg:min-w-0 ${
                      isActive
                        ? 'border-[#00df8f]/45 bg-[#00df8f]/[0.045] opacity-100'
                        : 'border-white/[0.07] bg-transparent opacity-60 hover:border-white/15 hover:opacity-100'
                    }`}
                  >
                  {isActive && (
                    <motion.span
                      layoutId="active-system-rail"
                      aria-hidden="true"
                      className="absolute inset-y-3 left-0 w-px origin-center bg-[#00df8f]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }}
                    />
                  )}
                  <span className="flex items-center justify-between gap-4">
                    <span className="flex items-baseline gap-3">
                      <span className="meta text-gray-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-base font-semibold tracking-[-0.02em] text-white">
                        {system.name}
                      </span>
                    </span>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: state.dot }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-3 pl-7">
                    <span className="text-xs text-gray-500">{system.category}</span>
                    <span className={`meta ${state.text}`}>{system.status}</span>
                  </span>
                  </motion.button>
                </SceneItem>
              );
            })}
          </Scene>

          <div className="lg:col-span-8" id="active-system">
            <div className="mb-3 flex items-center justify-between">
              <span className="meta text-[#00df8f]">Active system</span>
              <span className="meta text-gray-600">
                {String(activeIndex + 1).padStart(2, '0')} / {String(SYSTEMS.length).padStart(2, '0')}
              </span>
            </div>

            <p className="sr-only" aria-live="polite">
              {active.name} activated
            </p>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.article
                key={active.id}
                custom={direction}
                initial={reduce ? { opacity: 1 } : { opacity: 0, x: 12 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -8 * direction }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.32, ease: EASE }
                }
                className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#10151b] shadow-[0_30px_90px_-50px_rgba(0,0,0,0.95)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/[0.08] bg-[#090c10] sm:aspect-[16/10]">
                  <motion.img
                    key={active.image}
                    src={active.image}
                    alt={active.imageAlt || `${active.name} product preview`}
                    width={1600}
                    height={1000}
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    initial={reduce ? false : { scale: 1.04, opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d1116] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-[#0d1116]/80 px-3 py-1.5 backdrop-blur-sm sm:left-5 sm:top-5">
                    <StatusDot state={active.status} />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <div>
                      <p className="meta text-[#00df8f]">{active.category}</p>
                      <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                        {active.name}
                      </h3>
                    </div>
                    <span className="meta hidden shrink-0 text-gray-400 sm:block">
                      {active.tech}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7 md:p-9">
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.08, duration: 0.4, ease: EASE }}
                    className="max-w-2xl font-display text-xl font-medium leading-snug tracking-[-0.02em] text-white/90 md:text-2xl"
                  >
                    {active.purpose}
                  </motion.p>

                  <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 border-t border-white/[0.08] pt-7 sm:grid-cols-2">
                    {STORY_STEPS.map((step, index) => (
                      <motion.div
                        key={step.key}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: reduce ? 0 : 0.12 + index * 0.05,
                          duration: 0.38,
                          ease: EASE,
                        }}
                        className={step.key === 'outcome' ? 'sm:border-l sm:border-[#00df8f]/25 sm:pl-5' : ''}
                      >
                        <span className={`eyebrow ${step.key === 'outcome' ? 'text-[#00df8f]' : ''}`}>
                          {step.label}
                        </span>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          {active.story[step.key]}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs leading-5 text-gray-500">
                      {active.build.join(' · ')}
                    </p>
                    <a
                      href={active.link}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#00df8f]"
                    >
                      {active.linkLabel}
                      <ArrowUpRight
                        size={16}
                        className="text-[#00df8f] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
