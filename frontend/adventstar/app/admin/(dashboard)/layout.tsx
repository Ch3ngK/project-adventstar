import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminTopNav from "@/components/admin/AdminTopNav";

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
      <AdminTopNav />
      {children}
    </>
  );
}
