// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  redirects: async () => {
    return [
      // redirect all wordpress url for SEO
      {
        source: '/index.php/les-activites/:slug*',
        destination: '/les-activites',
        permanent: true
      },
      {
        source: '/index.php/la-plongee/:slug*',
        destination: '/les-activites',
        permanent: true
      },
      {
        source: '/index.php/mnuclubenpratique/:slug*',
        destination: '/les-activites',
        permanent: true
      },
      {
        source: '/index.php/component/ohanah/:slug*',
        destination: '/les-sorties',
        permanent: true
      },
      {
        source: '/index.php/contact',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/index.php/:slug*',
        destination: '/',
        permanent: true
      }
    ]
  }
})
