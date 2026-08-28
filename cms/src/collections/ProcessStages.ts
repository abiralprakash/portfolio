import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, publishedOrAuthenticated } from '../access/index.js'

export const ProcessStages: CollectionConfig = {
  slug: 'process-stages',
  labels: {
    singular: 'Process stage',
    plural: 'Process stages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    description: 'Chapter 03 — the build method accordion.',
    group: 'Content',
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  versions: { drafts: true, maxPerDoc: 10 },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '70%', description: 'Rendered uppercase, e.g. ARCHITECTURE' },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          admin: {
            width: '30%',
            step: 1,
            description: 'Also drives the displayed 01–06 index.',
          },
        },
      ],
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
  ],
}
