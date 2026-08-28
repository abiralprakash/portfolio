import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Capabilities } from './collections/Capabilities.js'
import { CaseStudies } from './collections/CaseStudies.js'
import { Media } from './collections/Media.js'
import { ProcessStages } from './collections/ProcessStages.js'
import { ProofPoints } from './collections/ProofPoints.js'
import { Systems } from './collections/Systems.js'
import { Users } from './collections/Users.js'
import { Identity } from './globals/Identity.js'
import { NowBench } from './globals/NowBench.js'
import { SiteSettings } from './globals/SiteSettings.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
} = process.env

// Media lives on local disk during authoring and moves to R2 automatically once
// bucket credentials exist, so the same config works locally and in production.
const useR2 = Boolean(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_ENDPOINT)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Prakash Adhikari CMS',
    },
    components: {},
  },
  collections: [Users, Media, Systems, Capabilities, ProcessStages, ProofPoints, CaseStudies],
  globals: [Identity, NowBench, SiteSettings],
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./cms.db',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  plugins: useR2
    ? [
        s3Storage({
          collections: { media: true },
          bucket: R2_BUCKET!,
          config: {
            endpoint: R2_ENDPOINT,
            region: 'auto',
            credentials: {
              accessKeyId: R2_ACCESS_KEY_ID!,
              secretAccessKey: R2_SECRET_ACCESS_KEY!,
            },
          },
        }),
      ]
    : [],
})
