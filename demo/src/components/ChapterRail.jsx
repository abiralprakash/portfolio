import { useEffect, useState } from 'react';
import { CHAPTERS } from '../content/index.js';
import { scrollToId } from '../scroll.js';

export default function ChapterRail() {
  const [active, setActive] = useState('identity');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapter progress"
      className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {CHAPTERS.map((chapter) => {
        const isActive = active === chapter.id;
        const n = chapter.index;
        return (
          <button
            key={chapter.id}
            type="button"
            title={chapter.label}
            aria-label={`Go to ${chapter.label}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => scrollToId(chapter.id)}
            className={`pointer-events-auto group flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-left transition-opacity duration-300 ${
              isActive ? 'opacity-100' : 'opacity-35 hover:opacity-80'
            }`}
          >
            <span
              className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-[#00df8f]' : 'bg-white/35 group-hover:bg-white/70'
              }`}
            />
            <span
              className={`meta transition-colors duration-300 ${
                isActive ? 'text-[#00df8f]' : 'text-gray-500 group-hover:text-gray-300'
              }`}
            >
              {n}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
