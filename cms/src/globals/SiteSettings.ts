import type { GlobalConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access/index.js'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    description: 'Navigation, chapter sequence, and shared SEO defaults for the Product Lab.',
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
          label: 'Navigation',
          fields: [
            {
              name: 'chapters',
              type: 'array',
              label: 'Chapter sequence',
              admin: {
                description:
                  'Drives the navbar, the chapter rail, and the numbered cues in each section.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'index',
                      type: 'text',
                      required: true,
                      admin: { width: '20%', description: 'e.g. 01' },
                    },
                    {
                      name: 'id',
                      type: 'text',
                      required: true,
                      admin: { width: '40%', description: 'Section element id, e.g. identity' },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: { width: '40%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteTitle', type: 'text', required: true },
            { name: 'siteDescription', type: 'textarea', required: true },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            {
              name: 'themeColor',
              type: 'text',
              defaultValue: '#0d1116',
              admin: { description: 'Browser theme colour for the Product Lab.' },
            },
          ],
        },
      ],
    },
  ],
}
