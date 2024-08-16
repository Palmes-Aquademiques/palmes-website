import * as React from 'react'

import * as types from 'notion-types'
import cs from 'classnames'
import { parsePageId } from 'notion-utils'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='h-20 bg-palmes-light bg-opacity-80 backdrop-saturate-150 backdrop-blur-lg drop-shadow-lg notion-header'>
      <div className='mx-auto notion-nav-header max-w-7xl'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs gap-0.5'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(
                      'text-palmes-dark rounded-lg font-medium px-5 py-2.5 text-center bg-opacity-50 text-lg hidden md:inline-block hover:text-white',
                      link.pageId === parsePageId(block?.id).replaceAll('-', '') ? 'text-white' : ''
                    )}
                  >
                    {link.title}
                  </components.PageLink>
                )
              }
            })
            .filter(Boolean)}

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}
