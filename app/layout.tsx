import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STATUS ON WEBSITE - Real-Time Trading Dashboard',
  description: 'Experience real-time market data and trading insights with our modern trading dashboard. Track stocks, manage portfolios, and analyze market trends.',
  keywords: 'trading, stocks, market data, portfolio, finance, real-time, dashboard',
  authors: [{ name: 'STATUS ON WEBSITE Team' }],
  creator: 'STATUS ON WEBSITE',
  publisher: 'STATUS ON WEBSITE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <ErrorBoundary>
                <Providers>{children}</Providers>
              </ErrorBoundary>
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with ❤️ by STATUS ON WEBSITE. Real-time market data and modern UI/UX.
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-right">
                  © 2025 STATUS ON WEBSITE. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
