import * as React from 'react'

import * as types from 'notion-types'
import { parsePageId } from 'notion-utils'
import { Header, useNotionContext } from 'react-notion-x'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { navigationLinks, navigationStyle } from '@/lib/config'
import { cn } from '@/lib/utils'

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='h-20 overflow-visible bg-palmes-light bg-opacity-80 backdrop-saturate-150 backdrop-blur-lg drop-shadow-lg notion-header'>
      <div className='mx-auto notion-nav-header max-w-7xl'>
        <Breadcrumbs block={block} />
        <NavigationMenu>
          <NavigationMenuList>
            {navigationLinks?.map((link, index) => {
              if (link.subPages) {
                return (
                  <NavigationMenuItem key={link.pageId}>
                    <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='flex w-64 p-4 gap-3'>
                        <li>
                          {link.subPages.map((link) => (
                            <components.PageLink
                              href={mapPageUrl(link.pageId)}
                              key={index}
                              className={cn(
                                'text-palmes-dark rounded-lg font-medium px-3 py-2.5 text-center bg-opacity-50 text-lg hidden md:inline-block'
                              )}
                            >
                              {link.title}
                            </components.PageLink>
                          ))}
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }
              if (link.pageId) {
                return (
                  <NavigationMenuItem key={link.pageId}>
                    <components.PageLink
                      href={mapPageUrl(link.pageId)}
                      key={index}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        link.pageId ===
                          parsePageId(block?.id).replaceAll('-', '')
                          ? 'text-white'
                          : ''
                      )}
                    >
                      {link.title}
                    </components.PageLink>
                  </NavigationMenuItem>
                )
              }
            })}
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport className='z-5000' />
        </NavigationMenu>
      </div>
    </header>
  )
}
