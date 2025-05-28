'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { FlagPicker } from 'components/flag-picker';
import { cn } from 'lib/utils';
import { DEFAULT_LANG, Lang } from 'translations';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from 'components/ui/navigation-menu';

interface MainNavProps {
  items: Array<
    | {
        title: Record<Lang, string>;
        href: string;
        description?: string;
        items?: never;
      }
    | {
        title: Record<Lang, string>;
        description?: Record<Lang, string>;
        href?: never;
        items: Array<{
          title: Record<Lang, string>;
          href: string;
          description?: Record<Lang, string>;
          background?: string;
        }>;
      }
  >;
  lang?: Lang;
}

export const MainNav: React.FC<MainNavProps> = ({
  items,
  lang = DEFAULT_LANG
}) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {items.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.href ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link prefetch href={item.href}>
                  {item.title[lang]}
                </Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>
                  {item.title[lang]}
                </NavigationMenuTrigger>

                {item.items && (
                  <NavigationMenuContent>
                    <ul className="flex flex-col gap-2 p-2">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex} className="w-100">
                          <NavigationMenuLink
                            className={cn(
                              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-4 rounded-md p-4 leading-none no-underline transition-colors outline-none select-none'
                            )}
                            asChild
                          >
                            <Link prefetch href={subItem.href}>
                              <div>
                                {subItem.background && (
                                  <Image
                                    className="rounded-md"
                                    src={subItem.background}
                                    alt={subItem.title[lang]}
                                    width={100}
                                    height={100}
                                  />
                                )}
                              </div>

                              <div className="flex flex-1 flex-col gap-1">
                                <div className="text-sm leading-none font-medium">
                                  {subItem.title[lang]}
                                </div>

                                {subItem.description && (
                                  <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                    {subItem.description[lang]}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                )}
              </>
            )}
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <FlagPicker value={lang} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
