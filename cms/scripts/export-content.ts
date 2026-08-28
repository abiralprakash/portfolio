/**
 * Exports published Payload content into the static bundle consumed by the
 * Product Lab frontend at demo/src/content/content.json.
 *
 * The deployed site is static assets on Cloudflare Workers, so content is
 * resolved at build time rather than fetched at runtime. Committing the export
 * keeps `npm run demo:build` working on machines that never run the CMS.
 *
 *   npm run export
 */
import 'dotenv/config'

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '../src/payload.config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const outFile = path.join(repoRoot, 'demo', 'src', 'content', 'content.json')

type MediaLike =
  | { staticPath?: string | null; url?: string | null; alt?: string | null }
  | number
  | string
  | null
  | undefined

/**
 * Media may be stored in Payload or already served by the site. staticPath wins
 * so the deployed bundle keeps pointing at assets that exist under /public.
 */
const mediaPath = (media: MediaLike): string | null => {
  if (!media || typeof media === 'number' || typeof media === 'string') return null
  return media.staticPath || media.url || null
}

const mediaAlt = (media: MediaLike): string | null => {
  if (!media || typeof media === 'number' || typeof media === 'string') return null
  return media.alt || null
}

const values = (rows?: { value: string }[] | null): string[] =>
  (rows ?? []).map((row) => row.value)

const run = async () => {
  const payload = await getPayload({ config })

  const [identity, now, settings, systems, capabilities, stages, proof] = await Promise.all([
    payload.findGlobal({ slug: 'identity', depth: 2 }),
    payload.findGlobal({ slug: 'now', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', depth: 2 }),
    payload.find({ collection: 'systems', limit: 100, sort: 'order', depth: 2 }),
    payload.find({ collection: 'capabilities', limit: 100, sort: 'order', depth: 1 }),
    payload.find({ collection: 'process-stages', limit: 100, sort: 'order', depth: 1 }),
    payload.find({ collection: 'proof-points', limit: 100, sort: 'order', depth: 1 }),
  ])

  const content = {
    generatedAt: new Date().toISOString(),
    identity: {
      name: identity.name,
      role: identity.role,
      location: identity.location,
      builderId: identity.builderId,
      version: identity.version,
      headlineLead: identity.headlineLead,
      headlineOutline: identity.headlineOutline,
      positioning: identity.positioning,
      philosophy: identity.philosophy,
      disciplines: values(identity.disciplines),
      email: identity.email,
      fullSite: identity.fullSite,
      socials: (identity.socials ?? []).map((s) => ({ label: s.label, href: s.href })),
      portrait: mediaPath(identity.portrait as MediaLike),
      portraitAlt: mediaAlt(identity.portrait as MediaLike),
    },
    proof: proof.docs.map((doc) => ({ value: doc.value, label: doc.label })),
    systems: systems.docs.map((doc) => ({
      id: doc.slug,
      name: doc.name,
      status: doc.status,
      category: doc.category,
      purpose: doc.purpose,
      tech: doc.tech,
      image: mediaPath(doc.preview as MediaLike),
      imageAlt: mediaAlt(doc.preview as MediaLike) ?? `${doc.name} product preview`,
      link: doc.link,
      linkLabel: doc.linkLabel,
      featured: Boolean(doc.featured),
      story: {
        problem: doc.story?.problem ?? '',
        system: doc.story?.system ?? '',
        intelligence: doc.story?.intelligence ?? '',
        outcome: doc.story?.outcome ?? '',
      },
      build: values(doc.build),
    })),
    process: stages.docs.map((doc) => ({
      n: String(doc.order).padStart(2, '0'),
      title: doc.title,
      body: doc.body,
    })),
    capabilities: capabilities.docs.map((doc) => ({
      id: doc.slug,
      title: doc.title,
      detail: doc.detail,
      tags: values(doc.tags),
      wide: Boolean(doc.wide),
    })),
    now: {
      status: now.status,
      building: {
        title: now.building?.title ?? '',
        note: now.building?.note ?? '',
      },
      focus: values(now.focus),
      available: values(now.available),
    },
    chapters: (settings.chapters ?? []).map((c) => ({
      index: c.index,
      id: c.id,
      label: c.label,
    })),
    seo: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      themeColor: settings.themeColor,
      ogImage: mediaPath(settings.ogImage as MediaLike),
    },
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, `${JSON.stringify(content, null, 2)}\n`, 'utf8')

  payload.logger.info(
    `Exported ${content.systems.length} systems, ${content.capabilities.length} capabilities, ` +
      `${content.process.length} process stages → demo/src/content/content.json`,
  )
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
