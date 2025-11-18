import type { Metadata } from 'next';
import { Afacad, Inter, Nunito } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';

const afacad = Afacad({
  subsets: ['latin'],
  variable: '--font-sans',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'BookMe - Smart Booking Platform',
  description: 'Multi-tenant SaaS booking platform for Hong Kong businesses',
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BookMe',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          afacad.variable,
          nunito.variable,
          inter.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

