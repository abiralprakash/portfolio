import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The CMS is an authoring surface only; the public site is deployed separately
  // to Cloudflare Workers from ./public.
  reactStrictMode: true,
}

export default withPayload(nextConfig)
