import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) redirect("/login");

	return (
		<div className="page-wrapper min-h-screen">
			<div className="ambient-left" />
			<AdminNav />
			<main className="relative z-10 pt-20">{children}</main>
		</div>
	);
}
