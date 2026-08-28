import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { IDENTITY, CHAPTERS } from '../content/index.js';
import { scrollToId } from '../scroll.js';
import { Outline } from './ui.jsx';
import { Button } from './ui/button.jsx';
import { Scene, SceneItem, MaskReveal, SceneLine, EASE } from './motion.jsx';

const MENU = CHAPTERS.filter((chapter) => chapter.id !== 'contact');

export default function Contact() {
  const reduce = useReducedMotion();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#0d1116] px-6 pb-10 pt-24 md:px-10 md:pt-36"
    >
      <Scene
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <SceneItem type="scale" as="span" className="select-none font-display text-[24vw] font-bold leading-[0.8] tracking-tighter text-white opacity-[0.022]">
          CONTACT
        </SceneItem>
      </Scene>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left: the channel */}
          <Scene
            stagger={0.11}
            className="lg:col-span-7"
          >
            <SceneItem className="flex items-center gap-3">
              <span className="meta text-[#00df8f]">06</span>
              <SceneLine className="h-px w-8 bg-[#00df8f]/40" />
              <span className="eyebrow">Contact</span>
            </SceneItem>
            <h2 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl md:text-[3.75rem]">
              <MaskReveal as="span" contentClassName="block pb-[0.08em]">
                Have a <Outline muted>system</Outline>
              </MaskReveal>
              <MaskReveal as="span" contentClassName="block pb-[0.08em]">
                in mind?
              </MaskReveal>
            </h2>
            <SceneItem as="p" className="mt-6 max-w-md text-base leading-relaxed text-gray-400">
              If you have a messy problem that needs more than a template, open a channel.
              Tell me what you are trying to build and where it hurts today.
            </SceneItem>

            <SceneItem>
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                onMouseMove={
                  reduce
                    ? undefined
                    : (event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
                        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
                        event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
                      }
                }
                onMouseLeave={
                  reduce
                    ? undefined
                    : (event) => {
                        event.currentTarget.style.transform = '';
                      }
                }
                transition={{ duration: 0.2, ease: EASE }}
                className="mt-8 inline-flex will-change-transform"
              >
                <Button asChild className="group">
                  <a href={`mailto:${IDENTITY.email}?subject=Have%20a%20system%20in%20mind`}>
                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                    {IDENTITY.email}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </Button>
              </motion.div>
            </SceneItem>

            <SceneItem as="p" className="mt-6 meta text-[#00df8f]">Available for selected work</SceneItem>
          </Scene>

          {/* Right: link columns */}
          <Scene
            delay={0.35}
            className="grid grid-cols-2 gap-8 lg:col-span-5 lg:justify-items-end"
          >
            <SceneItem type="right">
              <p className="eyebrow mb-5">Navigate</p>
              <ul className="space-y-3">
                {MENU.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(item.id)}
                      className="text-sm text-gray-300 transition-colors hover:text-[#00df8f]"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </SceneItem>
            <SceneItem type="right">
              <p className="eyebrow mb-5">Channels</p>
              <ul className="space-y-3">
                {IDENTITY.socials.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 transition-colors hover:text-[#00df8f]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={IDENTITY.fullSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 transition-colors hover:text-[#00df8f]"
                  >
                    Full site
                  </a>
                </li>
              </ul>
            </SceneItem>
          </Scene>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <span className="meta text-gray-600">
            &copy; 2026 Prakash Adhikari
          </span>
          <span className="meta text-gray-600">
            {IDENTITY.builderId} · {IDENTITY.version} · Kathmandu, Nepal
          </span>
        </div>
      </div>
    </footer>
  );
}
