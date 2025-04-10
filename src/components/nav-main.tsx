'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { LuExternalLink } from 'react-icons/lu';

import { MiniGold } from 'components/editor/blocks/button/gold';
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
    icon: LucideIcon;
    isActive: boolean;
    items?: {
      title: string;
      url: string;
      isActive: boolean;
      icon: LucideIcon;
      count?: number;
    }[];
  }[];
  dark?: boolean;
}) {
  return (
    <div
      className={cn({
        'dark z-10 bg-sidebar rounded-md sticky top-2 backdrop-blur-xs mx-1 shadow-lg inset-shadow-md border border-black/80 ring-1 ring-indigo-500/40':
          dark,
        'bg-gradient-to-b from-stone-900/75 via-stone-800/90 to-stone-900/80':
          dark
      })}
    >
      <SidebarGroup>
        <SidebarGroupLabel className="flex gap-2 items-center justify-between">
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
              <SidebarMenuItem className="gap-2 flex flex-col">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className="data-[active=true]:bg-transparent[data-active='true']"
                >
                  {item.url === '/affiliation' ? (
                    <MiniGold
                      href={item.url}
                      label={item.title}
                      className="h-auto text-center"
                    />
                  ) : (
                    <Link prefetch href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="gap-1 flex flex-col mr-0 pr-2">
                        {item.items?.map(subItem => (
                          <SidebarMenuSubItem
                            className="flex flex-col items-stretch"
                            key={subItem.title}
                          >
                            <SidebarMenuSubButton
                              className="flex-1 flex gap-2 p-2"
                              isActive={subItem.isActive}
                              asChild
                            >
                              <Link prefetch href={subItem.url}>
                                <subItem.icon />

                                <span className="flex-1 text-xs truncate">
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
