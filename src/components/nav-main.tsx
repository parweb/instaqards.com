'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

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
    icon: LucideIcon;
    isActive: boolean;
    items?: {
      title: string;
      url: string;
      isActive: boolean;
      icon: LucideIcon;
    }[];
  }[];
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        dark &&
          'dark bg-sidebar rounded-md sticky top-2 backdrop-blur-xs z-10 mx-1'
      )}
    >
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>

        <SidebarMenu>
          {items.map(item => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className="data-[active=true]:bg-transparent[data-active='true']"
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
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
                      <SidebarMenuSub>
                        {item.items?.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={subItem.isActive}
                              asChild
                            >
                              <Link href={subItem.url}>
                                <subItem.icon />
                                <span>{subItem.title}</span>
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
