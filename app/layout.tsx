import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giovanna & Samuel | Eterno",
  description: "Álbum Digital Premium de Casamento — Eterno Digital Memory Experience",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
