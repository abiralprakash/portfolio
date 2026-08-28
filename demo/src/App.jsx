import Navbar from './components/Navbar.jsx';
import ChapterRail from './components/ChapterRail.jsx';
import Hero from './components/Hero.jsx';
import CurrentSystems from './components/CurrentSystems.jsx';
import Process from './components/Process.jsx';
import Capabilities from './components/Capabilities.jsx';
import Now from './components/Now.jsx';
import Contact from './components/Contact.jsx';
import { TooltipProvider } from './components/ui/tooltip.jsx';

export default function App() {
  return (
    <TooltipProvider>
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#00df8f] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0d1116]"
      >
        Skip to content
      </a>
      <Navbar />
      <ChapterRail />
      <main id="main">
        <Hero />
        <CurrentSystems />
        <Process />
        <Capabilities />
        <Now />
      </main>
      <Contact />
    </div>
    </TooltipProvider>
  );
}
