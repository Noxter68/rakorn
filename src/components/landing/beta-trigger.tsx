"use client";

import { ouvrirBeta } from "@/lib/landing/beta-bus";
import { URL_DU_JEU, useBetaOuverte } from "@/lib/landing/ouverture";

/**
 * Un appel à rejoindre la bêta, où qu'il soit posé.
 *
 * Avant l'ouverture, c'est un `button` et non un lien : il n'y a pas de page
 * au bout — il ouvre la fenêtre d'inscription —, et un `a` sans destination
 * réelle ment à la barre d'état du navigateur comme au lecteur d'écran. Il
 * porte les classes qu'on lui donne — la barre du haut a les siennes, les deux
 * scènes ont celles des boutons d'appel — parce que le seul point commun entre
 * ces trois-là est ce qui se passe au clic.
 *
 * Une fois la bêta ouverte (`useBetaOuverte`), il devient un vrai lien vers
 * l'inscription du jeu, sous le mot `ouvert` ; `masquerOuvert` l'efface là où
 * le compte à rebours, devenu bouton, fait déjà l'appel.
 */
export function BetaTrigger({
  className,
  children,
  ouvert = "Jouer à la bêta",
  masquerOuvert = false,
}: {
  className: string;
  children: React.ReactNode;
  /** Le mot du lien une fois la bêta ouverte. */
  ouvert?: string;
  /** Une fois la bêta ouverte, ne rien rendre : un autre bouton fait l'appel. */
  masquerOuvert?: boolean;
}) {
  const estOuverte = useBetaOuverte();
  if (estOuverte) {
    if (masquerOuvert) return null;
    return (
      <a href={URL_DU_JEU} className={className}>
        {ouvert}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={ouvrirBeta}>
      {children}
    </button>
  );
}
