import type { Metadata } from "next";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import "./globals.css";
import { poppins } from "./ui/fonts";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

export const metadata: Metadata = {
  title: "Gateway",
  description:
    "Find your next opportunity with Gateway — a modern job search platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${poppins.variable} font-sans`}>
        <NextAuthProvider>
          <ReduxProvider>
            <NotificationProvider>
              <main>{children}</main>
            </NotificationProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
