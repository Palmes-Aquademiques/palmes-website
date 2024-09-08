import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { PageBlock } from 'notion-types'
import { formatDate, getPageProperty } from 'notion-utils'
import { NotionContextProvider, NotionRenderer } from 'react-notion-x'
import { useSearchParam } from 'react-use'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'

import { Footer } from './Footer'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageHead } from './PageHead'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

const propertyLastEditedTimeValue = (
  { block, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

export const Home: React.FC<
  types.PageProps & { subPageRecordMap: types.ExtendedRecordMap }
> = ({ site, recordMap, subPageRecordMap, error, pageId }) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Collection,
      Modal,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
    }),
    []
  )

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (router.isFallback) {
    return <Loading />
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  )

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />
      <NotionContextProvider
        recordMap={recordMap}
        components={components}
        mapImageUrl={mapImageUrl}
        mapPageUrl={siteMapPageUrl}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
      >
        <NotionPageHeader block={block as PageBlock} />
      </NotionContextProvider>
      <div className='flex flex-col w-full h-full min-h-screen -mt-20'>
        <NotionRenderer
          pageTitle={<></>}
          disableHeader={true}
          className='index-page'
          bodyClassName='index-page items-center justify-center text-center'
          components={components}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          rootDomain={site.domain}
          fullPage={true}
          previewImages={!!recordMap.preview_images}
          mapPageUrl={siteMapPageUrl}
          mapImageUrl={mapImageUrl}
          footer={<></>}
        />

        <div className='flex flex-col items-center justify-center w-full h-screen overflow-hidden'>
          <NotionRenderer
            className={'index-subpage'}
            bodyClassName={
              'index-subpage flex flex-col items-center justify-center'
            }
            components={components}
            recordMap={subPageRecordMap}
            rootPageId={site.rootNotionPageId}
            rootDomain={site.domain}
            fullPage={false}
            previewImages={!!recordMap.preview_images}
            mapPageUrl={siteMapPageUrl}
            mapImageUrl={mapImageUrl}
          />
          <Footer />
        </div>
      </div>
    </>
  )
}
