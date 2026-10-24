"use client";

import { useSyncExternalStore } from "react";
import { BETA_OUVERTE } from "./page";

/**
 * Ce que lit tout ce qui change à l'ouverture : l'interrupteur, l'adresse du
 * jeu, et l'horloge du compte à rebours.
 *
 * L'ouverture n'est pas une heure lue dans le navigateur mais un interrupteur
 * (`BETA_OUVERTE`, `page.ts`) : la page construite contient directement ce
 * qu'il faut montrer, et c'est le déploiement qui ouvre les portes. Le compte
 * à rebours garde son horloge pour le temps où l'interrupteur est éteint.
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

/** La bêta est-elle ouverte ? L'interrupteur, rien d'autre. */
export function useBetaOuverte(): boolean {
  return BETA_OUVERTE;
}
