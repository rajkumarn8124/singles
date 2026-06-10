import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "singles.com",
  description: "Dating and Networking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red-500">
              singles.com
            </Link>
            <nav className="space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-red-500">Log In</Link>
              <Link href="/signup" className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">Sign Up</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
