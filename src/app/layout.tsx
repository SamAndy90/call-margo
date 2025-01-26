import './globals.css';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Sidebar from '@/components/navigation/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Margo OS - Marketing OS for Small Business Founders',
  description: 'Streamline your marketing operations with Margo OS',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.className} h-full antialiased`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
