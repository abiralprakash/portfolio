import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { StatusDot } from './ui.jsx';
import { scrollToId } from '../scroll.js';

const LINKS = [
  { label: 'Identity', id: 'identity' },
  { label: 'Systems', id: 'systems' },
  { label: 'Process', id: 'process' },
  { label: 'Capabilities', id: 'capabilities' },
  { label: 'Now', id: 'now' },
  { label: 'Contact', id: 'contact' },
];

const SECTION_IDS = LINKS.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('identity');
  const reduce = useReducedMotion();
  const menuButtonRef = useRef(null);
  const mobileNavRef = useRef(null);
  const menuWasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const nav = mobileNavRef.current;
    const focusables = () =>
      nav
        ? [...nav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
            .filter((el) => !el.hasAttribute('disabled'))
        : [];

    requestAnimationFrame(() => {
      focusables()[0]?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      menuWasOpen.current = true;
      return;
    }
    if (!menuWasOpen.current) return;
    menuWasOpen.current = false;
    menuButtonRef.current?.focus({ preventScroll: true });
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed top-0 z-50 h-[4.5rem] w-full transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/[0.08] bg-[#0d1116]/88 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => handleNav('identity')}
            className="font-display text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
            aria-label="Back to top"
          >
            PRAKASH<span className="text-[#00df8f]">.</span>
          </button>
          <span className="hidden items-center gap-5 xl:flex">
            <span className="h-4 w-px bg-white/15" />
            <StatusDot state="ONLINE" label="ONLINE" />
          </span>
        </div>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              aria-current={active === link.id ? 'true' : undefined}
              className={`relative py-2 meta transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[#00df8f] after:transition-transform after:duration-200 ${
                active === link.id
                  ? 'text-white after:scale-x-100'
                  : 'text-gray-500 after:scale-x-0 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="hidden rounded-full border border-[#00df8f]/25 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#00df8f] transition-colors hover:border-[#00df8f]/50 hover:bg-[#00df8f]/[0.06] lg:block"
          >
            Start a build
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white transition-colors hover:border-[#00df8f]/60 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            ref={mobileNavRef}
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1116]/95 shadow-2xl backdrop-blur-md lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col p-2">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`flex min-h-12 items-center justify-between rounded-xl px-5 py-3.5 text-left meta transition-colors hover:bg-white/5 ${
                    active === link.id ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                  {active === link.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00df8f]" />
                  )}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
