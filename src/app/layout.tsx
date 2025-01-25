import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Margo OS",
  description: "Marketing OS for small business founders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
