"use client";

import { DATE_BETA, OUVERTURE_BETA } from "@/lib/landing/page";
import { URL_DU_JEU, useMaintenant } from "@/lib/landing/ouverture";

const SECONDE = 1000;
const MINUTE = 60 * SECONDE;
const HEURE = 60 * MINUTE;
const JOUR = 24 * HEURE;

const UNITES = ["Jours", "Heures", "Minutes", "Secondes"] as const;

/** Ce qui reste jusqu'à l'ouverture, unité par unité ; `null` une fois ouverte. */
function decompte(maintenant: number): number[] | null {
  const reste = new Date(OUVERTURE_BETA).getTime() - maintenant;
  if (reste <= 0) return null;
  return [
    Math.floor(reste / JOUR),
    Math.floor((reste % JOUR) / HEURE),
    Math.floor((reste % HEURE) / MINUTE),
    Math.floor((reste % MINUTE) / SECONDE),
  ];
}

/**
 * Le compte à rebours de la bêta, à l'ouverture de la page.
 *
 * ── Rien avant le montage ─────────────────────────────────────────────────
 *
 * La page est rendue en statique, à la construction : l'heure du serveur
 * n'est ni celle du visiteur ni celle d'aujourd'hui. Le premier rendu pose
 * donc des tirets, dans des cases de la même taille que les chiffres — rien
 * ne saute —, et le navigateur écrit les chiffres dès qu'il est là. Calculés
 * au rendu, ils auraient donné un désaccord d'hydratation à chaque visite.
 * C'est le rôle de l'instantané serveur de `useSyncExternalStore` : `null`
 * à la construction et à l'hydratation, l'heure juste ensuite.
 *
 * ── Une horloge, pas un décompte ──────────────────────────────────────────
 *
 * L'écart se recalcule depuis `Date.now()` à chaque tic au lieu de retrancher
 * une seconde au précédent : un onglet en arrière-plan voit ses minuteurs
 * ralentis, et un décompte qui soustrait aurait perdu des minutes pendant une
 * pause café.
 *
 * Les chiffres sont cachés aux lecteurs d'écran : une seconde qui change
 * n'apprend rien à qui écoute, la date qui les précède dit tout.
 *
 * ── À l'heure dite, le bouton ─────────────────────────────────────────────
 *
 * Le compte arrivé à zéro, la place qu'il tenait — juste au-dessus des
 * boutons, là où l'on demandait « pour quand ? » — revient au seul geste qui
 * compte désormais : entrer dans le jeu. Le bouton d'inscription du héros
 * s'efface en même temps (`BetaTrigger masquerOuvert`), pour ne pas faire
 * deux appels côte à côte.
 */
export function CompteARebours() {
  const maintenant = useMaintenant();
  const reste = maintenant === null ? undefined : decompte(maintenant);

  if (reste === null) {
    return (
      <div className="rpg-lp-decompte is-ouverte">
        <p className="rpg-lp-decompte-titre">La bêta est ouverte · cinquante places titrées</p>
        <a href={URL_DU_JEU} className="rpg-lp-btn is-entree">
          Entrer dans Rakorn
        </a>
      </div>
    );
  }

  return (
    <div className="rpg-lp-decompte">
      {/* La date ne se coupe pas : sur un téléphone, « 18 » finissait une
          ligne et « h » commençait la suivante. */}
      <p className="rpg-lp-decompte-titre">
        Ouverture de la bêta · <span className="whitespace-nowrap">le {DATE_BETA}</span>
      </p>
      <ol className="rpg-lp-decompte-cases" aria-hidden>
        {UNITES.map((quoi, i) => (
          <li key={quoi}>
            <b>{reste ? String(reste[i]).padStart(2, "0") : "––"}</b>
            <span>{quoi}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
