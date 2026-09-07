"use client";

/**
 * Le fil qui relie les trois boutons à l'unique modale.
 *
 * Trois appels vivent dans trois scènes différentes — la barre du haut,
 * l'ouverture, la clôture — et doivent ouvrir la même fenêtre, montée une
 * seule fois au pied de la page. Un contexte React aurait obligé à envelopper
 * toutes les scènes dans un fournisseur client, c'est-à-dire à faire passer
 * onze scènes serveur à travers une frontière qu'elles n'ont aucune raison de
 * traverser. Un `EventTarget` de module fait le même travail en six lignes et
 * ne touche pas à l'arbre.
 */

const CIBLE = new EventTarget();
const OUVRIR = "ouvrir";

export function ouvrirBeta() {
  CIBLE.dispatchEvent(new Event(OUVRIR));
}

export function surOuvertureBeta(reaction: () => void) {
  CIBLE.addEventListener(OUVRIR, reaction);
  return () => CIBLE.removeEventListener(OUVRIR, reaction);
}
