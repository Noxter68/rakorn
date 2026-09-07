"use client";

import { ouvrirBeta } from "@/lib/landing/beta-bus";

/**
 * Un appel à rejoindre la bêta, où qu'il soit posé.
 *
 * C'est un `button` et non un lien : il n'y a pas de page au bout, et un `a`
 * sans destination réelle ment à la barre d'état du navigateur comme au
 * lecteur d'écran. Il porte les classes qu'on lui donne — la barre du haut a
 * les siennes, les deux scènes ont celles des boutons d'appel — parce que le
 * seul point commun entre ces trois-là est ce qui se passe au clic.
 */
export function BetaTrigger({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={ouvrirBeta}>
      {children}
    </button>
  );
}
