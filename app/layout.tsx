import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Álbum Digital | Giovanna & Samuel',
  description: 'Álbum físico digital de casamento com galeria, recados e envio de fotos.',
  openGraph: {
    title: 'Álbum Digital | Giovanna & Samuel',
    description: 'Deixe seu recado e compartilhe seus registros do grande sim.',
    images: ['/whatsapp-preview.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
