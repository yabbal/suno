import { RootProvider } from "fumadocs-ui/provider/next";
import SearchDialog from "@/components/search";
import "./global.css";
import type { ReactNode } from "react";

export const metadata = {
	title: {
		default: "Suno CLI",
		template: "%s | Suno CLI",
	},
	description:
		"TypeScript SDK & CLI for Suno",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex flex-col min-h-screen">
				<RootProvider search={{ SearchDialog }}>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
