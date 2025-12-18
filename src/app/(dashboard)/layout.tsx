import { DashboardSidebar } from "@/pages/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/pages/dashboard/dashboard-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <DashboardNavbar />
          <div className="p-6 max-w-480 mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
