import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import { AuthProvider } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Margo OS - Marketing OS for Small Business Founders",
  description: "Streamline your marketing operations with Margo OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <Navigation />
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
