/**
 * CMS-driven content for the Product Lab.
 *
 * Source of truth is Payload (`cms/`). `content.json` is the published snapshot
 * written by `npm run cms:export`. The site stays static on Cloudflare Workers
 * because this file is bundled at build time.
 */
import content from './content.json'

export const IDENTITY = content.identity
export const PROOF = content.proof
export const SYSTEMS = content.systems
export const PROCESS = content.process
export const CAPABILITIES = content.capabilities
export const NOW = content.now
export const CHAPTERS = content.chapters
export const SEO = content.seo
