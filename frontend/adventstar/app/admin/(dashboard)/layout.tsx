import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adventstar_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-64">{children}</div>
    </>
  );
}
