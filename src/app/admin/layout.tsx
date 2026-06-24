import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "لوحة الإدارة - تشطيب",
  description: "لوحة تحكم المشرفين لتشطيب",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Enforce ADMIN or MANAGER role (adjust based on your UserRole type)
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gallery-white" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative flex flex-col">
        {/* Simple Topbar for mobile/extra actions if needed */}
        <header className="h-16 bg-white border-b border-stone flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-headline-md text-xl text-obsidian">إدارة النظام</h1>
          <div className="flex items-center gap-4 text-sm text-secondary">
            مرحباً، <span className="font-bold text-obsidian">{user.name || user.email}</span>
            <span className="bg-obsidian/10 px-2 py-1 rounded text-xs tracking-wider">{user.role}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
