import * as React from 'react'

import * as types from 'notion-types'
import { getPageBreadcrumbs } from 'notion-utils'
import { PageIcon, useNotionContext } from 'react-notion-x'

import { name, rootNotionPageId } from '@/lib/config'

export const Breadcrumbs: React.FC<{ block: types.Block }> = ({ block }) => {
  const { recordMap, mapPageUrl, components } = useNotionContext()
  const breadcrumb = React.useMemo(() => {
    const breadcrumbs = getPageBreadcrumbs(recordMap, block.id)
    return breadcrumbs[0]
  }, [recordMap, block.id])

  const pageLinkProps = {
    href: mapPageUrl(rootNotionPageId)
  }
  const componentMap = {
    pageLink: components.PageLink
  }

  return (
    <div className='h-full' key='breadcrumbs'>
      <componentMap.pageLink
        className='flex items-center justify-center h-full overflow-hidden align-center no-wrap text-ellipsis'
        {...pageLinkProps}
      >
        <span className='breadcrumb'>
          {breadcrumb.icon && <PageIcon block={breadcrumb.block} />}
        </span>

        <span className='title'>{name}</span>
      </componentMap.pageLink>
    </div>
  )
}
