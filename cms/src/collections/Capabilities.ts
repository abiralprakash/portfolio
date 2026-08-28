import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, publishedOrAuthenticated } from '../access/index.js'

export const Capabilities: CollectionConfig = {
  slug: 'capabilities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    description: 'Chapter 04 — what Prakash can be hired to build.',
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
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'detail',
      type: 'textarea',
      required: true,
      admin: { description: 'Two lines maximum — this renders inside a compact grid cell.' },
    },
    {
      name: 'tags',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    {
      name: 'wide',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Span two columns in the capability grid.',
      },
    },
  ],
}
