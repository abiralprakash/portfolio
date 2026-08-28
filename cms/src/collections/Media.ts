import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, anyone } from '../access/index.js'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'category'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    // WebP derivatives keep the deployed payload small; the product lab loads these directly.
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: undefined,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'card',
        width: 960,
        height: undefined,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'hero',
        width: 1440,
        height: undefined,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers. Required for every upload.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption shown beneath the image in editorial contexts.',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'system',
      options: [
        { label: 'System preview', value: 'system' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Artifact / diagram', value: 'artifact' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'staticPath',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'Optional absolute path already served by the site (for example /demo-assets/systems/nepal-ipms-hero.webp). When set, the export uses this instead of an uploaded file.',
      },
    },
  ],
}
