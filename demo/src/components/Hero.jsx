import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { IDENTITY, PROOF } from '../content/index.js';
import { scrollToId } from '../scroll.js';
import { StatusDot } from './ui.jsx';
import { Button } from './ui/button.jsx';
import { Scene, SceneItem, MaskReveal, SceneLine, SOFT_SPRING } from './motion.jsx';
import { Spotlight } from './aceternity/spotlight.jsx';
import { BackgroundBeams } from './aceternity/background-beams.jsx';
import { HoverBorderGradient } from './aceternity/hover-border-gradient.jsx';

export default function Hero() {
  const constraintsRef = useRef(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section
      id="identity"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-background pt-20"
    >
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <BackgroundBeams className="opacity-40" />
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <span className="select-none font-display text-[20vw] font-bold leading-none tracking-tighter text-white opacity-[0.015]">
          BUILD
        </span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-20 lg:py-16">
        <Scene trigger="mount" delay={0.1} stagger={0.11}>
          <SceneItem className="mb-5 flex items-center gap-3">
            <span className="meta text-primary">01</span>
            <SceneLine className="h-px w-8 bg-primary/40" />
            <span className="eyebrow">Identity</span>
          </SceneItem>

          <SceneItem className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="meta text-white/75">{IDENTITY.name}</span>
            <SceneLine className="h-px w-5 bg-primary/60" />
            <span className="meta text-primary">{IDENTITY.role}</span>
          </SceneItem>

          <h1 className="max-w-3xl font-display text-[2.75rem] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5rem]">
            <MaskReveal as="span" contentClassName="block pb-[0.08em]">
              {IDENTITY.headlineLead}
            </MaskReveal>
            <MaskReveal as="span" contentClassName="block pb-[0.08em]">
              <span className="text-outline">{IDENTITY.headlineOutline}</span>
              <span className="text-primary">.</span>
            </MaskReveal>
          </h1>

          <SceneItem as="p" className="mt-6 max-w-xl text-base leading-7 text-gray-300/75 sm:text-[1.05rem]">
            {IDENTITY.positioning}
          </SceneItem>

          <SceneItem className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            {IDENTITY.disciplines.map((d, i) => (
              <span key={d} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-2 bg-white/15" />}
                <span className="meta text-gray-500">{d}</span>
              </span>
            ))}
          </SceneItem>

          <SceneItem className="mt-8 flex flex-wrap items-center gap-5">
            <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
              <Button type="button" onClick={() => scrollToId('systems')} className="group">
                View current systems
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Button>
            </motion.div>
            <Button variant="link" type="button" onClick={() => scrollToId('contact')} className="group">
              Start a build
              <ArrowUpRight
                size={16}
                className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Button>
          </SceneItem>

          <SceneItem className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-8">
            {PROOF.slice(0, 3).map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {value}
                </div>
                <div className="mt-1 text-[10px] uppercase leading-snug tracking-[0.12em] text-gray-600 sm:max-w-[7.5rem]">
                  {label}
                </div>
              </div>
            ))}
          </SceneItem>
        </Scene>

        <Scene
          ref={constraintsRef}
          trigger="mount"
          delay={0.42}
          className="relative flex items-center justify-center py-4 lg:min-h-[520px] lg:py-0"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-[-18vh] z-0 hidden h-[28vh] w-2 -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/35 lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-8 z-0 hidden h-5 w-5 -translate-x-1/2 rounded-full border border-primary/35 bg-card lg:block"
            aria-hidden="true"
          />

          <SceneItem
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 28, scale: 0.97 },
                    show: { opacity: 1, y: 0, scale: 1, transition: SOFT_SPRING },
                  }
            }
            className="relative z-10"
          >
            <motion.div
              drag={isDesktop && !reduce}
              dragElastic={0.18}
              dragConstraints={constraintsRef}
              dragTransition={{ bounceStiffness: 540, bounceDamping: 22 }}
              whileDrag={
                reduce
                  ? undefined
                  : { scale: 1.02, rotate: 1.2, cursor: 'grabbing' }
              }
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              }
              className={isDesktop ? 'cursor-grab' : ''}
            >
              <HoverBorderGradient className="w-[260px] select-none shadow-[0_32px_90px_-30px_rgba(0,0,0,0.9)] sm:w-[300px]">
                <div className="p-3">
                  <div className="flex items-center justify-between px-2 pb-3 pt-1">
                    <span className="meta text-gray-500">BUILDER ID</span>
                    <StatusDot state="BUILDING" label="BUILDING" />
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="relative aspect-[4/5] w-full">
                      <img
                        src={IDENTITY.portrait || '/demo-assets/portrait.jpg'}
                        alt={IDENTITY.portraitAlt || `Portrait of ${IDENTITY.name}`}
                        width="640"
                        height="960"
                        fetchPriority="high"
                        draggable="false"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5 pt-16">
                        <p className="font-display text-2xl font-bold tracking-tight text-white">
                          Prakash<span className="text-primary">.</span>
                        </p>
                        <p className="mt-0.5 meta text-gray-400">{IDENTITY.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 px-2 py-3">
                    <span className="flex items-center gap-1.5 meta text-gray-500">
                      <MapPin size={11} className="text-primary" />
                      {IDENTITY.location}
                    </span>
                    <span className="meta text-right text-gray-500">{IDENTITY.builderId}</span>
                    <span className="meta text-gray-500">FOCUS · LEGALTECH</span>
                    <span className="meta text-right text-gray-600">
                      {IDENTITY.version}
                      {isDesktop ? ' · DRAG' : ''}
                    </span>
                  </div>
                </div>
              </HoverBorderGradient>
            </motion.div>
          </SceneItem>
        </Scene>
      </div>
    </section>
  );
}
