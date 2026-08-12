import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "FRAME/GOA — Build Your Builder ID", description: "Create your Hacker House Goa 2026 Builder ID.", metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
