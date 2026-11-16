import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

/**
 * Archivo variável com o eixo de largura: normal no texto e expandida
 * (`font-wide`) nos títulos, números e na marca.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: "Prova",
    template: "%s | Prova",
  },
  description:
    "Avaliações de produtos feitas por quem comprou e usou, com nota de 0 a 5.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
