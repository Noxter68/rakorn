"use client";

import { useSyncExternalStore } from "react";
import { OUVERTURE_BETA } from "./page";

/**
 * L'heure de l'ouverture, lue par tout ce qui change ce jour-là.
 *
 * La vitrine est construite en statique, avant l'ouverture : c'est donc le
 * navigateur qui décide, à la seconde, si la bêta est ouverte. Le compte à
 * rebours laisse alors sa place au bouton qui mène au jeu, les appels à
 * s'inscrire deviennent des liens vers le jeu, et la scène finale cesse de
 * demander une adresse — sans redéploiement à dix-huit heures.
 *
 * Ce qu'elle refuse : décider à la construction. L'instantané serveur dit
 * « fermée », comme la page qu'on construit, et la bascule n'a lieu qu'une
 * fois le navigateur monté : sans quoi l'hydratation se fâcherait à chaque
 * visite d'après dix-huit heures.
 */

/** Où mène la vitrine une fois la bêta ouverte : l'inscription du jeu. */
export const URL_DU_JEU = "https://play.rakorn.fr/register";

const SECONDE = 1000;

function abonner(prevenir: () => void) {
  const tic = setInterval(prevenir, SECONDE);
  return () => clearInterval(tic);
}
/* La seconde entière : React relit l'instantané plusieurs fois par rendu et
   exige qu'il ne change pas entre deux lectures. */
const seconde = () => Math.floor(Date.now() / SECONDE) * SECONDE;
const aucune = () => null;

/** L'heure, à la seconde ; `null` à la construction et à l'hydratation. */
export function useMaintenant(): number | null {
  return useSyncExternalStore(abonner, seconde, aucune);
}

/** La bêta est-elle ouverte, à l'heure du navigateur ? */
export function useBetaOuverte(): boolean {
  const maintenant = useMaintenant();
  return maintenant !== null && maintenant >= new Date(OUVERTURE_BETA).getTime();
}
