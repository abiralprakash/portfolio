import type { GlobalConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/index.js'

export const Identity: GlobalConfig = {
  slug: 'identity',
  label: 'Identity',
  admin: {
    description: 'Chapter 01 — who this is, and the language used across the lab.',
    group: 'Settings',
  },
  access: {
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: { drafts: false, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Person',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'location', type: 'text', required: true, admin: { width: '34%' } },
                {
                  name: 'builderId',
                  type: 'text',
                  required: true,
                  admin: { width: '33%', description: 'e.g. PKA-2026' },
                },
                {
                  name: 'version',
                  type: 'text',
                  required: true,
                  admin: { width: '33%', description: 'e.g. v2.1' },
                },
              ],
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Hero portrait shown in the identity card.' },
            },
          ],
        },
        {
          label: 'Language',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'headlineLead',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'First headline line (solid).' },
                },
                {
                  name: 'headlineOutline',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Second headline line (outlined).' },
                },
              ],
            },
            { name: 'positioning', type: 'textarea', required: true },
            {
              name: 'philosophy',
              type: 'textarea',
              required: true,
              admin: { description: 'Quoted at the top of the process chapter.' },
            },
            {
              name: 'disciplines',
              type: 'array',
              minRows: 1,
              admin: { initCollapsed: true },
              fields: [{ name: 'value', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email', required: true },
            { name: 'fullSite', type: 'text', required: true },
            {
              name: 'socials',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
