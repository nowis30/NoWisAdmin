import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';

import '@/app/globals.css';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });
const displayFont = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'NoWisAdmin',
  description: 'Administration privee pour les contenus et reglages du site NoWis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}