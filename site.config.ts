import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'c7965933a2f44643b705244b5864c9b2',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: 'dc8530a0-66bf-45fc-975c-71930ad1cb32',

  // basic site info (required)
  name: 'Les Palmes ',
  domain: 'staging.lespalmesaquademiques.fr',
  author: 'Les Palmes Aquadémiques',

  // open graph metadata (optional)
  description: 'Club associatif de plongée sous-marine et de nage en eau vive (NEV), affilié à la FFESSM',

  // social usernames (optional)
  facebook: 'palmes.aquademiques',
  email: 'palmes.aquademiques@gmail.com',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Le Club',
      pageId: '64db3c2922704fefbad52285036d7111'
    },
    {
      title: 'Contact',
      pageId: 'a50c7ff573ab4e918a5c0d90cad2db62'
    }
  ],
  isSearchEnabled: false,
})
