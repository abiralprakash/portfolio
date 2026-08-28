/**
 * Compatibility shim. New code should import from `../content/index.js`.
 * Payload CMS is the source of truth; this re-exports the published snapshot.
 */
export {
  IDENTITY,
  PROOF,
  SYSTEMS,
  PROCESS,
  CAPABILITIES,
  NOW,
  CHAPTERS,
  SEO,
} from './content/index.js'
