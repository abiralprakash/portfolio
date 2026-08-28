import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CAPABILITIES } from '../data.js';
import { SectionHeader } from './ui.jsx';
import { Scene, SceneItem, SOFT_SPRING } from './motion.jsx';

export default function Capabilities() {
  const [focused, setFocused] = useState(null);
  const reduce = useReducedMotion();

  return (
    <section id="capabilities" className="section-scene relative bg-[#10141a] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="04"
          label="Capabilities"
          title="What I can help you build."
          intro="The systems I take from a difficult idea to a working product."
        />

        <Scene
          stagger={0.075}
          className="mt-16 grid grid-cols-1 border-t border-white/[0.09] sm:grid-cols-2"
        >
          {CAPABILITIES.map((capability, index) => (
            <SceneItem
              key={capability.id}
              type={index === 0 ? 'scale' : index % 2 === 0 ? 'right' : 'left'}
              distance={18}
              className={`${index === CAPABILITIES.length - 1 ? 'sm:col-span-2' : ''}`}
            >
              <motion.article
                tabIndex={0}
                onHoverStart={() => setFocused(capability.id)}
                onHoverEnd={() => setFocused(null)}
                onFocus={() => setFocused(capability.id)}
                onBlur={() => setFocused(null)}
                animate={
                  reduce
                    ? undefined
                    : {
                        y: focused === capability.id ? -2 : 0,
                      }
                }
                transition={SOFT_SPRING}
                className={`group relative h-full border-b border-white/[0.09] py-8 transition-colors duration-200 sm:min-h-[220px] sm:px-8 ${
                  index % 2 === 0 && index !== CAPABILITIES.length - 1 ? 'sm:border-r' : ''
                }`}
              >
                <div className="flex h-full max-w-xl flex-col justify-between gap-10">
                  <span className="meta text-gray-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.035em] text-white transition-colors duration-200 group-hover:text-[#00df8f] group-focus:text-[#00df8f]">
                      {capability.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-[0.95rem] leading-7 text-gray-400">
                      {capability.detail}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {capability.tags.map((tag) => (
                        <span
                          key={tag}
                          className="meta text-gray-600 transition-colors group-hover:text-gray-400 group-focus:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </SceneItem>
          ))}
        </Scene>
      </div>
    </section>
  );
}
