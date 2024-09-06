import * as React from 'react'

import * as types from 'notion-types'
import { Menu } from 'lucide-react'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
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
    <header className='z-40 h-20 overflow-visible bg-palmes-light bg-opacity-80 backdrop-saturate-150 backdrop-blur-lg drop-shadow-lg notion-header'>
      <div className='absolute top-0 left-0 right-0 flex flex-row items-center justify-start h-full px-3 mx-auto md:justify-between max-w-7xl gap-3'>
        <Sheet>
          <SheetTrigger className='flex md:hidden'>
            <Menu className='w-6 h-6' />
          </SheetTrigger>
          <SheetContent className='flex flex-col md:hidden bg-palmes-light' side='left'>
            <SheetHeader>
              <SheetTitle>
                <Breadcrumbs block={block} />
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-4'>
              {navigationLinks?.map((link, index) => {
                if (link.subPages) {
                  return (
                    <ul className='flex w-64 p-4 gap-3' key={link.pageId}>
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
                  )
                }
                if (link.pageId) {
                  return (
                    <components.PageLink
                      href={mapPageUrl(link.pageId)}
                      key={link.pageId}
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
                  )
                }
              })}
            </div>
          </SheetContent>
        </Sheet>
        <Breadcrumbs block={block} />
        <NavigationMenu className='hidden md:flex'>
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
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </header>
  )
}
