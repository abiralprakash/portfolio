import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, publishedOrAuthenticated } from '../access/index.js'

export const ProofPoints: CollectionConfig = {
  slug: 'proof-points',
  labels: {
    singular: 'Proof point',
    plural: 'Proof points',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['value', 'label', 'order'],
    description: 'Verified production numbers shown in the hero. No vanity metrics.',
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
          name: 'value',
          type: 'text',
          required: true,
          admin: { width: '30%', description: 'e.g. 130K+' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. Trademark records handled' },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: { width: '20%', step: 1 },
        },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Where this number comes from. Internal only — keeps claims auditable.',
      },
    },
  ],
}
