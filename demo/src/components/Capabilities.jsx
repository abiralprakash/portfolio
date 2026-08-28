import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CAPABILITIES } from '../content/index.js';
import { SectionHeader } from './ui.jsx';
import { Card, CardTitle, CardDescription } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Scene, SceneItem, SOFT_SPRING } from './motion.jsx';

export default function Capabilities() {
  const [focused, setFocused] = useState(null);
  const reduce = useReducedMotion();

  return (
    <section id="capabilities" className="section-scene relative bg-secondary py-24 md:py-36">
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
              className={capability.wide ? 'sm:col-span-2' : ''}
            >
              <motion.div
                tabIndex={0}
                onHoverStart={() => setFocused(capability.id)}
                onHoverEnd={() => setFocused(null)}
                onFocus={() => setFocused(capability.id)}
                onBlur={() => setFocused(null)}
                animate={reduce ? undefined : { y: focused === capability.id ? -2 : 0 }}
                transition={SOFT_SPRING}
                className="group h-full"
              >
                <Card
                  className={
                    index % 2 === 0 && !capability.wide ? 'sm:border-r sm:border-white/[0.09]' : ''
                  }
                >
                  <div className="flex h-full max-w-xl flex-col justify-between gap-10">
                    <span className="meta text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <CardTitle>{capability.title}</CardTitle>
                      <CardDescription>{capability.detail}</CardDescription>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {capability.tags.map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </SceneItem>
          ))}
        </Scene>
      </div>
    </section>
  );
}
