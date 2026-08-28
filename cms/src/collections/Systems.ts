import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, publishedOrAuthenticated } from '../access/index.js'

export const SYSTEM_STATUSES = [
  { label: 'Live', value: 'LIVE' },
  { label: 'Scaling', value: 'SCALING' },
  { label: 'Building', value: 'BUILDING' },
  { label: 'Experiment', value: 'EXPERIMENT' },
  { label: 'Archived', value: 'ARCHIVED' },
] as const

export const Systems: CollectionConfig = {
  slug: 'systems',
  labels: {
    singular: 'System',
    plural: 'Systems',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'category', 'order'],
    description:
      'Products and platforms shown in chapter 02 of the Product Lab. Order controls the switcher sequence.',
    group: 'Content',
    listSearchableFields: ['name', 'category', 'purpose'],
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
    maxPerDoc: 20,
  },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { width: '60%' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '40%',
            description: 'Stable identifier used by the frontend switcher.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'LIVE',
          options: [...SYSTEM_STATUSES],
          admin: { width: '33%' },
        },
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: { width: '34%', description: 'For example: LegalTech SaaS' },
        },
        {
          name: 'tech',
          type: 'text',
          required: true,
          admin: { width: '33%', description: 'Short stack line, e.g. Cloudflare · Next.js' },
        },
      ],
    },
    {
      name: 'purpose',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One sentence describing what the system is for.',
      },
    },
    {
      name: 'story',
      type: 'group',
      label: 'Narrative',
      admin: {
        description: 'The four beats rendered in the system detail panel.',
      },
      fields: [
        { name: 'problem', type: 'textarea', required: true },
        { name: 'system', type: 'textarea', required: true },
        { name: 'intelligence', type: 'textarea', required: true },
        { name: 'outcome', type: 'textarea', required: true },
      ],
    },
    {
      name: 'build',
      type: 'array',
      label: 'Build tags',
      minRows: 1,
      admin: {
        description: 'Rendered as a middot-separated stack line.',
        initCollapsed: true,
      },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Product preview image. Falls back to the media record staticPath when unset.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: { width: '60%', description: 'External URL or internal path.' },
        },
        {
          name: 'linkLabel',
          type: 'text',
          required: true,
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'caseStudy',
      type: 'relationship',
      relationTo: 'case-studies',
      admin: {
        position: 'sidebar',
        description: 'Optional long-form case study for this system.',
      },
    },
    {
      name: 'capabilities',
      type: 'relationship',
      relationTo: 'capabilities',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Capabilities this system demonstrates.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        step: 1,
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Selected by default when the Product Lab loads.',
      },
    },
  ],
}
