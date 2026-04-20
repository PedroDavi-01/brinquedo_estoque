import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 " suppressHydrationWarning>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}