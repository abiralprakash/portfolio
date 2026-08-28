/**
 * Seeds Payload from the content that previously lived in demo/src/data.js.
 * Idempotent: documents are matched on slug and updated in place, so this can be
 * re-run safely after schema changes.
 *
 *   npm run seed
 */
import 'dotenv/config'

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { getPayload } from 'payload'

import config from '../src/payload.config.js'
import { CAPABILITIES, IDENTITY, NOW, PROCESS, PROOF, SYSTEMS } from './seed-data.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')
const publicDir = path.join(repoRoot, 'public')

const toValues = (values: string[]) => values.map((value) => ({ value }))

/** Resolves a site-absolute asset path (/demo-assets/...) to a file on disk. */
const resolveAsset = (webPath: string): string | null => {
  const filePath = path.join(publicDir, webPath.replace(/^\//, ''))
  return fs.existsSync(filePath) ? filePath : null
}

const run = async () => {
  const payload = await getPayload({ config })

  // ---------------------------------------------------------------- admin user
  const email = process.env.SEED_ADMIN_EMAIL || 'hello@prakashadhikari.dev'
  const password = process.env.SEED_ADMIN_PASSWORD || 'change-this-password'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: IDENTITY.name, role: 'admin' },
    })
    payload.logger.info(`Created admin user ${email}`)
  } else {
    payload.logger.info(`Admin user ${email} already exists`)
  }

  // -------------------------------------------------------------------- media
  /** Uploads a static asset once and records the path the site already serves. */
  const upsertMedia = async (
    webPath: string,
    alt: string,
    category: 'system' | 'portrait' | 'artifact' | 'other',
  ): Promise<number | string | null> => {
    const existing = await payload.find({
      collection: 'media',
      where: { staticPath: { equals: webPath } },
      limit: 1,
    })
    if (existing.docs.length > 0) return existing.docs[0].id

    const filePath = resolveAsset(webPath)
    if (!filePath) {
      payload.logger.warn(`Asset missing on disk, skipping: ${webPath}`)
      return null
    }

    // SVGs bypass sharp-based resizing, so store them as a path-only record.
    if (filePath.endsWith('.svg')) {
      const doc = await payload.create({
        collection: 'media',
        data: { alt, category, staticPath: webPath },
        filePath,
      })
      return doc.id
    }

    const doc = await payload.create({
      collection: 'media',
      data: { alt, category, staticPath: webPath },
      filePath,
    })
    payload.logger.info(`Uploaded media ${webPath}`)
    return doc.id
  }

  const portraitId = await upsertMedia(
    '/demo-assets/portrait.jpg',
    `Portrait of ${IDENTITY.name}`,
    'portrait',
  )

  // ------------------------------------------------------------------ systems
  for (const [index, system] of SYSTEMS.entries()) {
    const previewId = await upsertMedia(system.image, `${system.name} product preview`, 'system')

    const data = {
      name: system.name,
      slug: system.id,
      status: system.status,
      category: system.category,
      tech: system.tech,
      purpose: system.purpose,
      story: system.story,
      build: toValues(system.build),
      link: system.link,
      linkLabel: system.linkLabel,
      order: index,
      featured: index === 0,
      ...(previewId ? { preview: previewId } : {}),
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'systems',
      where: { slug: { equals: system.id } },
      limit: 1,
      draft: true,
    })

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'systems', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'systems', data })
    }
    payload.logger.info(`Seeded system ${system.name}`)
  }

  // ------------------------------------------------------------- capabilities
  for (const [index, capability] of CAPABILITIES.entries()) {
    const data = {
      title: capability.title,
      slug: capability.id,
      detail: capability.detail,
      tags: toValues(capability.tags),
      order: index,
      wide: index === CAPABILITIES.length - 1,
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'capabilities',
      where: { slug: { equals: capability.id } },
      limit: 1,
      draft: true,
    })

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'capabilities', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'capabilities', data })
    }
  }
  payload.logger.info(`Seeded ${CAPABILITIES.length} capabilities`)

  // ----------------------------------------------------------- process stages
  for (const stage of PROCESS) {
    const order = Number(stage.n)
    const data = {
      title: stage.title,
      body: stage.body,
      order,
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'process-stages',
      where: { title: { equals: stage.title } },
      limit: 1,
      draft: true,
    })

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'process-stages', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'process-stages', data })
    }
  }
  payload.logger.info(`Seeded ${PROCESS.length} process stages`)

  // ------------------------------------------------------------- proof points
  for (const [index, proof] of PROOF.entries()) {
    const data = {
      value: proof.value,
      label: proof.label,
      order: index,
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'proof-points',
      where: { label: { equals: proof.label } },
      limit: 1,
      draft: true,
    })

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'proof-points', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'proof-points', data })
    }
  }
  payload.logger.info(`Seeded ${PROOF.length} proof points`)

  // ------------------------------------------------------------------ globals
  await payload.updateGlobal({
    slug: 'identity',
    data: {
      name: IDENTITY.name,
      role: IDENTITY.role,
      location: IDENTITY.location,
      builderId: IDENTITY.builderId,
      version: IDENTITY.version,
      headlineLead: IDENTITY.headlineLead,
      headlineOutline: IDENTITY.headlineOutline,
      positioning: IDENTITY.positioning,
      philosophy: IDENTITY.philosophy,
      disciplines: toValues(IDENTITY.disciplines),
      email: IDENTITY.email,
      fullSite: IDENTITY.fullSite,
      socials: IDENTITY.socials,
      ...(portraitId ? { portrait: portraitId } : {}),
    },
  })

  await payload.updateGlobal({
    slug: 'now',
    data: {
      status: NOW.status,
      building: NOW.building,
      focus: toValues(NOW.focus),
      available: toValues(NOW.available),
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteTitle: `${IDENTITY.name} — ${IDENTITY.role}`,
      siteDescription:
        'Personal Product Lab — identity, systems, process, and what is on the bench now.',
      themeColor: '#0d1116',
      chapters: [
        { index: '01', id: 'identity', label: 'Identity' },
        { index: '02', id: 'systems', label: 'Systems' },
        { index: '03', id: 'process', label: 'Process' },
        { index: '04', id: 'capabilities', label: 'Capabilities' },
        { index: '05', id: 'now', label: 'Now' },
        { index: '06', id: 'contact', label: 'Contact' },
      ],
    },
  })

  payload.logger.info('Seeded globals: identity, now, site-settings')
  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
