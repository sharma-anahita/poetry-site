import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import RecoveryRedirect from "@/components/RecoveryRedirect";
import "./globals.css";

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
	display: "swap",
});

const cormorant = Cormorant_Garamond({
	subsets: ["latin"],
	variable: "--font-cormorant",
	weight: ["300", "400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "In the Still Hours",
	description: "A quiet place for poetry written in the margins of night.",
	openGraph: {
		title: "In the Still Hours",
		description: "A quiet place for poetry written in the margins of night.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
			<body className="bg-ink text-parchment antialiased">
				<RecoveryRedirect />
				{children}
			</body>
		</html>
	);
}
