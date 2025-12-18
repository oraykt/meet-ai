import { DashboardSidebar } from "@/pages/dashboard/ui/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/pages/dashboard/ui/dashboard-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <DashboardNavbar />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
