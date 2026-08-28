/**
 * Canonical migration content, lifted from the original demo/src/data.js.
 * Payload is the source of truth after the first seed; this file exists so the
 * database can be rebuilt from scratch. Every claim here is verified against the
 * public site — no fabricated metrics, users, or revenue.
 */

export const IDENTITY = {
  name: 'Prakash Adhikari',
  role: 'AI Product Builder',
  location: 'Kathmandu / Remote',
  builderId: 'PKA-2026',
  version: 'v2.1',
  headlineLead: 'I turn complex ideas',
  headlineOutline: 'into working systems',
  positioning:
    'AI products, SaaS platforms, automation systems, and digital tools — built from idea to working product.',
  disciplines: ['AI', 'Product', 'Design', 'Engineering', 'Automation'],
  philosophy:
    'I am interested in problems messy enough to require more than a template. The interesting part is not the idea — it is making the system actually work.',
  email: 'hello@prakashadhikari.dev',
  socials: [
    { label: 'GitHub', href: 'https://github.com/abiralprakash' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abiralprakash/' },
    { label: 'Facebook', href: 'https://facebook.com/jptag' },
  ],
  fullSite: 'https://prakash-portfolio.prakash-adhikari65.workers.dev/',
}

export const PROOF = [
  { value: '130K+', label: 'Trademark records handled' },
  { value: '300+', label: 'API endpoints' },
  { value: '150+', label: 'Database migrations' },
  { value: '100+', label: 'SEO legal pages' },
]

export const SYSTEMS = [
  {
    id: 'nepalipms',
    name: 'NepalIPMS',
    status: 'LIVE',
    category: 'LegalTech SaaS',
    purpose: 'The operating system for an IP law practice.',
    tech: 'Cloudflare · Next.js',
    image: '/demo-assets/systems/nepal-ipms-hero.webp',
    link: 'https://nepalipms.com',
    linkLabel: 'nepalipms.com',
    story: {
      problem:
        'IP firms tracked renewals in spreadsheets, files scattered across drives, and Department of Industry status in memory — until a client called.',
      system:
        'I modeled the desk itself: company → file → matter → asset. Deadline engines, register search, litigation, and documents in one platform — 300+ API endpoints and 150+ migrations on Cloudflare Workers, D1, and R2.',
      intelligence:
        'A 130K+ record trademark register made searchable during live client calls, with OCR bulletin intake wired directly into matter creation.',
      outcome:
        '130K+ trademark records managed and used daily by IP firms, including Global Law Associates.',
    },
    build: ['Next.js', 'TypeScript', 'Cloudflare', 'D1 / R2', 'OCR'],
  },
  {
    id: 'ocr',
    name: 'AI OCR Engine',
    status: 'SCALING',
    category: 'Document Intelligence',
    purpose: 'Legal bulletins turned into structured, reviewable data.',
    tech: 'OCR · Workers · R2',
    image: '/demo-assets/systems/nepal-ipms-workflow.webp',
    link: '/case/ai-ocr-engine.html',
    linkLabel: 'Read the case study',
    story: {
      problem:
        'Government trademark bulletins arrived as dense bilingual PDFs, and staff re-typed rows by hand during filing season.',
      system:
        'A staged pipeline: upload → R2 → layout OCR → classification → AI extraction → review queue → register search and reminders. Extraction is separated from intelligence so nothing merges blindly.',
      intelligence:
        'AI extraction proposes fields; a human confirms confidence before anything becomes a matter. Acceleration with expert control intact.',
      outcome: 'Moved from prototype to production intake running inside NepalIPMS.',
    },
    build: ['OCR', 'Workers', 'R2', 'Extraction', 'Review UX'],
  },
  {
    id: 'globallaw',
    name: 'Global Law',
    status: 'LIVE',
    category: 'Legal Platform',
    purpose: 'A knowledge platform for a practicing IP firm.',
    tech: 'CMS · Cloudflare',
    image: '/demo-assets/systems/globallaw-hero.webp',
    link: 'https://globallaw.com.np',
    linkLabel: 'globallaw.com.np',
    story: {
      problem:
        'A serious IP and corporate practice needed a credible digital presence and a place to publish legal knowledge — not a brochure site.',
      system:
        'Content architecture first: practice areas, a knowledge center, and 100+ SEO-ready pages the firm can maintain on its own.',
      intelligence:
        'Structured publishing workflows and an SEO surface designed for discovery and long-term maintenance.',
      outcome:
        'Live at globallaw.com.np; the same firm runs its daily IP operations on NepalIPMS.',
    },
    build: ['CMS', 'SEO', 'Cloudflare', 'Content architecture'],
  },
  {
    id: 'scholarquest',
    name: 'ScholarQuest',
    status: 'LIVE',
    category: 'Education',
    purpose: 'The full study-abroad journey in one platform.',
    tech: 'Web platform',
    image: '/demo-assets/systems/scholarquest-hero.webp',
    link: 'https://scholarquest.com.np',
    linkLabel: 'scholarquest.com.np',
    story: {
      problem:
        'Study-abroad guidance was fragmented across destinations, test prep, and counsellors.',
      system:
        'A single platform for destination guidance, test preparation, and counsellor-ready lead intake across the entire student journey.',
      intelligence:
        'A content and conversion architecture that routes students from discovery to a structured inquiry.',
      outcome: 'Live in market at scholarquest.com.np.',
    },
    build: ['Web platform', 'Content systems', 'Lead intake'],
  },
  {
    id: 'toprank',
    name: 'TopRank Nepal',
    status: 'LIVE',
    category: 'EdTech',
    purpose: 'Bilingual, mobile-first public-service exam prep.',
    tech: 'Mobile-first',
    image: '/demo-assets/systems/toprank-hero.webp',
    link: 'https://topranknepal.com',
    linkLabel: 'topranknepal.com',
    story: {
      problem:
        'Nepal public-service exam preparation lacked structured, mobile-first digital tools.',
      system:
        'A bilingual (Nepali / English) learning shell with mobile-first study navigation for PSC aspirants.',
      intelligence: 'A learning UX designed around how aspirants actually study on their phones.',
      outcome: 'Live production platform for PSC aspirants.',
    },
    build: ['Mobile-first', 'Bilingual UI', 'Learning UX'],
  },
  {
    id: 'hire-expert',
    name: 'Hire an Expert',
    status: 'EXPERIMENT',
    category: 'Marketplace',
    purpose: 'Trust-first matching between clients and verified experts.',
    tech: 'System design',
    image: '/assets/shots/hire-expert.svg',
    link: '/case/hire-an-expert.html',
    linkLabel: 'Read the case study',
    story: {
      problem:
        'Expert discovery is opaque, and quality is hard to verify before you commit.',
      system:
        'A marketplace architecture built around verification: structured brief → match → engagement, with admin onboarding and quality-control paths.',
      intelligence:
        'A trust model that treats verification and matching as the core product, not an afterthought.',
      outcome:
        'Designed as a full system architecture — documented as a case study rather than a live product.',
    },
    build: ['Marketplace', 'Matching', 'Trust systems'],
  },
]

export const PROCESS = [
  {
    n: '01',
    title: 'RESEARCH',
    body: 'Sit with the real desk, files, and failure modes. Map who decides, who operates, and what "done" actually looks like before a line of code exists.',
  },
  {
    n: '02',
    title: 'PRODUCT DESIGN',
    body: 'Shape the path people repeat every day so the product disappears into the workflow instead of adding one more thing to manage.',
  },
  {
    n: '03',
    title: 'ARCHITECTURE',
    body: 'Model data, boundaries, and failure recovery — domain models shaped like the real world, from company to file to matter to asset.',
  },
  {
    n: '04',
    title: 'DEVELOPMENT',
    body: 'APIs, persistence, auth, and operational safety. 300+ endpoints and 150+ migrations built to hold up under real firm load.',
  },
  {
    n: '05',
    title: 'INTELLIGENCE',
    body: 'Add extraction, retrieval, or automation only where it genuinely reduces work — always with a human confidence review before anything commits.',
  },
  {
    n: '06',
    title: 'DEPLOYMENT',
    body: 'Edge-native release on Cloudflare, then watch production use closely and tighten the parts that actually matter.',
  },
]

export const CAPABILITIES = [
  {
    id: 'ai-product',
    title: 'AI Product Development',
    detail:
      'Turning an idea into an intelligent system people can use — where the AI is wired into a real workflow, not bolted on for show.',
    tags: ['Retrieval', 'Extraction', 'Human-in-the-loop'],
  },
  {
    id: 'saas',
    title: 'SaaS & Business Systems',
    detail:
      'Domain modeling, API surfaces, migrations, and auth for systems a small team can actually run in production.',
    tags: ['Domain modeling', 'APIs', 'Cloudflare'],
  },
  {
    id: 'docintel',
    title: 'Document Intelligence',
    detail:
      'Messy documents become structured, reviewable data — with confidence scoring and a review screen as part of the product.',
    tags: ['OCR', 'Search', 'Review UX'],
  },
  {
    id: 'design',
    title: 'Product Design & Prototyping',
    detail:
      'Interfaces and prototypes that make a complex system feel obvious — the path a user repeats every day.',
    tags: ['UX', 'Prototyping', 'Interaction'],
  },
  {
    id: 'automation',
    title: 'Automation & Integration',
    detail:
      'Deadline engines, intake flows, and integrations that remove the repetitive work still done by hand.',
    tags: ['Workflows', 'Triggers', 'Integrations'],
  },
]

export const NOW = {
  status: 'AVAILABLE FOR SELECTED WORK',
  building: {
    title: 'Deepening the AI OCR engine inside NepalIPMS',
    note: 'Extending bulletin intake and review so more of the legal desk runs on structured, confident data.',
  },
  focus: [
    'AI-native workflows',
    'Document intelligence',
    'Legal technology',
    'Product infrastructure',
  ],
  available: [
    'AI Product Development',
    'Technical Architecture',
    'SaaS Consulting',
    'Automation Systems',
  ],
}
