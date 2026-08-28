import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { StatusDot } from './ui.jsx';
import { Button } from './ui/button.jsx';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetClose,
} from './ui/sheet.jsx';
import { CHAPTERS } from '../content/index.js';
import { scrollToId } from '../scroll.js';

const LINKS = CHAPTERS.map((chapter) => ({ label: chapter.label, id: chapter.id }));
const SECTION_IDS = LINKS.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('identity');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed top-0 z-50 h-[4.5rem] w-full transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/[0.08] bg-background/88 backdrop-blur-md'
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
            PRAKASH<span className="text-primary">.</span>
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
              className={`relative py-2 meta transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-200 ${
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleNav('contact')}
            className="hidden lg:inline-flex"
          >
            Start a build
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-white/12 text-white hover:border-primary/60 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/96">
              <SheetHeader>
                <SheetTitle>
                  PRAKASH<span className="text-primary">.</span>
                </SheetTitle>
                <SheetDescription>Primary navigation</SheetDescription>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Close
                  </Button>
                </SheetClose>
              </SheetHeader>
              <SheetBody>
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
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
