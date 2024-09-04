import * as React from 'react'
import Link from 'next/link'

import * as types from 'notion-types'
import { parsePageId } from 'notion-utils'
import { Header, Search, useNotionContext } from 'react-notion-x'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { cn } from '@/lib/utils'

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='text-sm leading-snug line-clamp-2 text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

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
        <Breadcrumbs block={block} />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                  <li className='row-span-3'>
                    <NavigationMenuLink asChild>
                      <a
                        className='flex flex-col justify-end w-full h-full p-6 no-underline outline-none select-none rounded-md bg-gradient-to-b from-muted/50 to-muted focus:shadow-md'
                        href='/'
                      >
                        <div className='mt-4 mb-2 text-lg font-medium'>
                          shadcn/ui
                        </div>
                        <p className='text-sm leading-tight text-muted-foreground'>
                          Beautifully designed components built with Radix UI
                          and Tailwind CSS.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href='/docs' title='Introduction'>
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href='/docs/installation' title='Installation'>
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href='/docs/primitives/typography'
                    title='Typography'
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/docs' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport className='z-5000' />
        </NavigationMenu>
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
                    className={cn(
                      'text-palmes-dark rounded-lg font-medium px-5 py-2.5 text-center bg-opacity-50 text-lg hidden md:inline-block hover:text-white',
                      link.pageId === parsePageId(block?.id).replaceAll('-', '')
                        ? 'text-white'
                        : ''
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
