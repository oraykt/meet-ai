'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import DashboardUser from './dashboard-user';
export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Summaries', href: '/dashboard/summaries', icon: FileText },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];
  const secItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Summaries', href: '/dashboard/summaries', icon: FileText },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center gap-2">
          <img src="/meet-ai-logo.svg" alt="Meet.AI Logo" className="w-8 h-8" />
          <span className="font-semibold">Meet.AI</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex justify-between">
        <SidebarGroup>
          <SidebarGroupContent>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className={cn(
                    'h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50',
                    pathname === item.href &&
                      'bg-linear-to-r/oklch border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50'
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <div className="px-4 py-2">
              <Separator className="text-black" />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            {secItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className={cn(
                    'h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50',
                    pathname === item.href &&
                      'bg-linear-to-r/oklch border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50'
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DashboardUser />
        {/* <div className="space-y-3">
          <div className="grid grid-cols-2">
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <div className="flex justify-end">
              <Button className="text-xs bg-amber-600 hover:bg-amber-400 text-white">
                <StarIcon />
                Upgrade
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push('/sign-in'),
                },
              })
            }
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div> */}
      </SidebarFooter>
    </Sidebar>
  );
}
