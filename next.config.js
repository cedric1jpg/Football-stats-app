const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'www.thesportsdb.com', 'tmssl.akamaized.net'], // Add domains for team logos
  },
}

module.exports = withPWA(nextConfig)
