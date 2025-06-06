'use client';

import Link from 'next/link';
import { type IconType as LucideIcon } from 'react-icons';

import {
  LuFolder,
  LuSeparatorHorizontal,
  LuShare,
  LuTrash2
} from 'react-icons/lu';

import CreateSiteButtonSidebar from 'components/create-site-button-sidebar';
import CreateSiteModal from 'components/modal/create-site';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from 'components/ui/sidebar';

export function NavProjects({
  projects
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    secondaryUrl?: string;
    clicks: number;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Qards</span>

        <CreateSiteButtonSidebar>
          <CreateSiteModal />
        </CreateSiteButtonSidebar>
      </SidebarGroupLabel>

      <SidebarMenu>
        {projects.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link prefetch href={item.url}>
                <item.icon />
                <span className="truncate">{item.name}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <LuSeparatorHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem asChild>
                  <Link prefetch href={item.url}>
                    <LuFolder className="text-muted-foreground" />
                    <span>View Project</span>
                  </Link>
                </DropdownMenuItem>

                {item.secondaryUrl && (
                  <DropdownMenuItem asChild>
                    <Link href={item.secondaryUrl} target="_blank">
                      <LuShare className="text-muted-foreground" />
                      <span>Share Project</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link prefetch href={`${item.url}/settings`}>
                    <LuTrash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
