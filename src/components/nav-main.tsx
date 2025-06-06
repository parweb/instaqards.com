'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';
import { LuChevronRight, LuExternalLink } from 'react-icons/lu';

import { Badge } from 'components/ui/badge';
import { cn } from 'lib/utils';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from 'components/ui/collapsible';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from 'components/ui/sidebar';

export function NavMain({
  label,
  items,
  dark = false
}: {
  label: string;
  items: {
    title: string;
    url: string;
    secondaryUrl?: string;
    icon: IconType;
    isActive: boolean;
    items?: {
      title: string;
      url: string;
      isActive: boolean;
      icon: IconType;
      count?: number;
    }[];
  }[];
  dark?: boolean;
}) {
  return (
    <div
      className={cn({
        'dark bg-sidebar inset-shadow-md sticky top-2 z-10 mx-1 rounded-md border border-black/80 shadow-lg ring-1 ring-indigo-500/40 backdrop-blur-xs':
          dark,
        'bg-gradient-to-b from-stone-900/75 via-stone-800/90 to-stone-900/80':
          dark
      })}
    >
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between gap-2">
          <span>{label}</span>

          {dark && (
            <Link
              prefetch
              href={items.at(0)?.secondaryUrl ?? ''}
              target="_blank"
              className="hover:text-white"
            >
              <LuExternalLink />
            </Link>
          )}
        </SidebarGroupLabel>

        <SidebarMenu>
          {items.map(item => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem className="flex flex-col gap-2">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className="data-[active=true]:bg-transparent[data-active='true']"
                >
                  <Link prefetch href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <LuChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mr-0 flex flex-col gap-1 pr-2">
                        {item.items?.map(subItem => (
                          <SidebarMenuSubItem
                            className="flex flex-col items-stretch"
                            key={subItem.title}
                          >
                            <SidebarMenuSubButton
                              className="flex flex-1 gap-2 p-2"
                              isActive={subItem.isActive}
                              asChild
                            >
                              <Link prefetch href={subItem.url}>
                                <subItem.icon />

                                <span className="flex-1 truncate text-xs">
                                  {subItem.title}
                                </span>

                                {!!subItem.count && subItem.count > 0 && (
                                  <Badge className="bg-white/2.5">
                                    {subItem.count.toString()}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
