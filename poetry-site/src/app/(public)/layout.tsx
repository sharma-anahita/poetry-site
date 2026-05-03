import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="page-wrapper">
			<div className="ambient-left" />
			<div className="ambient-right" />
			<Nav />
			<main className="relative z-10">{children}</main>
			<Footer />
		</div>
	);
}
