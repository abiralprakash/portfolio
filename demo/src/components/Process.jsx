import { IDENTITY, PROCESS } from '../content/index.js';
import { SectionHeader, Outline } from './ui.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion.jsx';
import { Scene, SceneItem, MaskReveal } from './motion.jsx';

export default function Process() {
  return (
    <section id="process" className="section-scene relative overflow-hidden bg-background py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeader
          index="03"
          label="How I Build"
          title={
            <>
              From messy problem to <Outline muted>working system</Outline>.
            </>
          }
        />

        <Scene className="mt-10 max-w-3xl">
          <MaskReveal
            as="p"
            contentClassName="font-display text-2xl font-medium leading-[1.3] tracking-[-0.025em] text-white/85 md:text-3xl"
          >
            {IDENTITY.philosophy}
          </MaskReveal>
        </Scene>

        <Scene stagger={0.06} className="mt-16">
          <SceneItem>
            <Accordion type="single" collapsible defaultValue="stage-0">
              {PROCESS.map((stage, index) => (
                <AccordionItem key={stage.n} value={`stage-${index}`}>
                  <AccordionTrigger index={stage.n}>{stage.title}</AccordionTrigger>
                  <AccordionContent>{stage.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SceneItem>
        </Scene>
      </div>
    </section>
  );
}
