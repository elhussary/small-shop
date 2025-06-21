import Sidebar from "@/features/dashboard/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-16 flex min-h-screen">
      <Sidebar />
      <section className="flex-1">{children}</section>
    </main>
  );
}
