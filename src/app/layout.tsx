import "./globals.css";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Margo OS",
  description: "Your AI Marketing Assistant",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createServerComponentClient({ cookies });
  // await supabase.auth.getSession();

  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full bg-white text-gray-500`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} h-full antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
