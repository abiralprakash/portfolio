import { NOW } from '../data.js';
import { SectionHeader, StatusDot } from './ui.jsx';
import { Scene, SceneItem } from './motion.jsx';

export default function Now() {
  return (
    <section id="now" className="section-scene relative bg-[#0d1116] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader index="05" label="Now" title="What's on the bench." />
          <Scene>
            <SceneItem>
              <StatusDot state="ONLINE" label={NOW.status} className="shrink-0" />
            </SceneItem>
          </Scene>
        </div>

        <Scene
          stagger={0.12}
          className="grid grid-cols-1 border-y border-white/[0.09] lg:grid-cols-12"
        >
          <SceneItem type="scale" className="py-10 lg:col-span-8 lg:py-14 lg:pr-16">
            <StatusDot state="BUILDING" label="CURRENTLY BUILDING" />
            <h3 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white md:text-4xl">
              {NOW.building.title}
            </h3>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-400">
              {NOW.building.note}
            </p>
          </SceneItem>

          <SceneItem type="right" className="grid grid-cols-1 border-t border-white/[0.09] sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0">
            <div className="py-8 sm:pr-6 lg:px-8 lg:py-10">
              <p className="eyebrow">Focus</p>
              <ul className="mt-5 space-y-3">
                {NOW.focus.map((focus) => (
                  <li key={focus} className="text-sm text-gray-300">
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/[0.09] py-8 sm:border-l sm:border-t-0 sm:pl-6 lg:border-l-0 lg:border-t lg:px-8 lg:py-10">
              <p className="eyebrow">Available for</p>
              <ul className="mt-5 space-y-3">
                {NOW.available.map((item) => (
                  <li key={item} className="text-sm text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SceneItem>
        </Scene>
      </div>
    </section>
  );
}
