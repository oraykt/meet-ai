"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, PanelLeftCloseIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import DashboardUser from "./dashboard-user";
import { Button } from "@/components/ui/button";
export function DashboardSidebar() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Agents", href: "/dashboard/agents", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];
  const secItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Agents", href: "/dashboard/agents", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-3 ">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <img src="/meet-ai-logo.svg" alt="Meet.AI Logo" className="w-8 h-8" />
            <span className="font-semibold">Meet.AI</span>
          </div>
          {isMobile && (
            <div>
              <Button onClick={toggleSidebar} variant="ghost">
                <PanelLeftCloseIcon />
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex justify-between">
        <SidebarGroup>
          <SidebarGroupContent>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  className={cn(
                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                    pathname === item.href &&
                      "bg-linear-to-r/oklch border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
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
                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                    pathname === item.href &&
                      "bg-linear-to-r/oklch border-[#ee43ee]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
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
      </SidebarFooter>
    </Sidebar>
  );
}
