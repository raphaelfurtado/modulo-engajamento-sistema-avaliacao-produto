import type { Metadata } from "next";
import { Nanum_Pen_Script, Schibsted_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
});

// Fonte manuscrita: usada apenas nos números das notas.
const pen = Nanum_Pen_Script({
  variable: "--font-pen",
  weight: "400",
  subsets: ["latin"],
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
    <html
      lang="pt-BR"
      className={`${schibsted.variable} ${pen.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
