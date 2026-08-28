import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, publishedOrAuthenticated } from '../access/index.js'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Case study',
    plural: 'Case studies',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kicker', 'updatedAt'],
    description:
      'Long-form writeups behind each system. These map to the /case/* pages on the main site.',
    group: 'Content',
    listSearchableFields: ['title', 'kicker', 'impact'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  versions: {
    drafts: { autosave: { interval: 800 } },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
              name: 'kicker',
              type: 'text',
              required: true,
              admin: { description: 'e.g. Case study · Education platform' },
            },
            {
              name: 'impact',
              type: 'textarea',
              required: true,
              admin: { description: 'The one-line outcome shown under the title.' },
            },
            {
              name: 'brief',
              type: 'array',
              label: 'Brief',
              admin: {
                description: 'Product / Problem / My role / Outcome definition list.',
                initCollapsed: true,
              },
              fields: [
                { name: 'term', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
              ],
            },
            {
              name: 'body',
              type: 'richText',
              admin: {
                description: 'Main narrative. Supports headings, lists, links, and media.',
              },
            },
          ],
        },
        {
          label: 'Media & links',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'liveUrl',
              type: 'text',
              admin: { description: 'Production URL, if the system is public.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
