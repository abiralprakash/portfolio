import type { GlobalConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/index.js'

export const NowBench: GlobalConfig = {
  slug: 'now',
  label: 'Now / bench',
  admin: {
    description: 'Chapter 05 — what is on the bench and what work is open.',
    group: 'Settings',
  },
  access: {
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: { drafts: false, max: 20 },
  fields: [
    {
      name: 'status',
      type: 'text',
      required: true,
      admin: { description: 'e.g. AVAILABLE FOR SELECTED WORK' },
    },
    {
      name: 'building',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'note', type: 'textarea', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'focus',
          type: 'array',
          label: 'Current focus',
          admin: { width: '50%', initCollapsed: true },
          fields: [{ name: 'value', type: 'text', required: true }],
        },
        {
          name: 'available',
          type: 'array',
          label: 'Available for',
          admin: { width: '50%', initCollapsed: true },
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
    },
  ],
}
