import { Scene, SceneItem, MaskReveal, SceneLine } from './motion.jsx';
export { EASE } from './motion.jsx';

// Shared status color language across the whole lab.
export const STATE_STYLES = {
  LIVE: { dot: '#00df8f', text: 'text-[#00df8f]', pulse: false },
  BUILDING: { dot: '#facc15', text: 'text-yellow-400', pulse: true },
  SCALING: { dot: '#38bdf8', text: 'text-sky-400', pulse: false },
  EXPERIMENT: { dot: '#a78bfa', text: 'text-violet-400', pulse: false },
  ARCHIVED: { dot: '#6b7280', text: 'text-gray-500', pulse: false },
  ONLINE: { dot: '#00df8f', text: 'text-[#00df8f]', pulse: true },
};

export function StatusDot({ state = 'LIVE', label, className = '' }) {
  const s = STATE_STYLES[state] ?? STATE_STYLES.LIVE;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.pulse ? 'animate-pulse-dot' : ''}`}
        style={{ backgroundColor: s.dot }}
        aria-hidden="true"
      />
      <span className={`meta ${s.text}`}>{label ?? state}</span>
    </span>
  );
}

// Consistent section header: index marker + label + oversized title + intro.
export function SectionHeader({ index, label, title, intro, align = 'left' }) {
  const centered = align === 'center';
  return (
    <Scene
      stagger={0.09}
      className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <SceneItem
        className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
      >
        <span className="meta text-[#00df8f]">{index}</span>
        <SceneLine className="h-px w-8 bg-[#00df8f]/40" />
        <span className="eyebrow">{label}</span>
      </SceneItem>
      <MaskReveal
        as="h2"
        className="mt-5"
        contentClassName="font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-[3.5rem]"
      >
          {title}
      </MaskReveal>
      {intro && (
        <SceneItem
          as="div"
          className={`mt-5 ${centered ? 'mx-auto' : ''} max-w-xl`}
        >
          <p className="text-[0.95rem] leading-7 text-gray-400">{intro}</p>
        </SceneItem>
      )}
    </Scene>
  );
}

// Uniform outline-stroke word used in oversized titles.
export function Outline({ children, muted = false }) {
  return <span className={muted ? 'text-outline-muted' : 'text-outline'}>{children}</span>;
}
