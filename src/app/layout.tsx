import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { ImageDragGuard } from "@/components/image-drag-guard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Rakorn",
  description: "Un RPG économique de récolte, d'artisanat et de commerce.",
};

/**
 * Le socle de la vitrine.
 *
 * Deux polices et rien d'autre. Le jeu enveloppe son arbre de quatre
 * fournisseurs — curseur, notifications, requêtes, session ; aucun n'a de
 * raison d'être ici : une page publique n'interroge pas d'API, n'affiche pas
 * de notification et n'a pas de panneau de réglages où choisir son curseur.
 * Ce qui reste est le seul emprunt qui tienne debout tout seul : les
 * illustrations qu'on ne décolle pas du décor.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ImageDragGuard />
        {children}
      </body>
    </html>
  );
}
