import { FICHES } from "@/lib/landing/fiches";
import { etapesDe, type Metier } from "@/lib/landing/metiers";
import { FlowRow } from "./flow-row";
import { ItemFiche } from "./item-fiche";

/**
 * Un métier : ses quatre marches au centre, la fiche de la dernière à droite.
 *
 * Deux questions, dans l'ordre où elles se posent. *Que fait-on,
 * concrètement ?* — récolter, fabriquer, échanger, et la dernière marche du
 * métier. *Et ça donne quoi ?* — la fiche du jeu, avec ses chiffres.
 *
 * La fiche vit dans la **colonne de droite de la scène**, et non dans la
 * surimpression : elle y prend toute la hauteur, du haut des onglets au pied
 * de page, et peut donc grandir sans venir couvrir le texte du bas. Voir
 * `.is-fiche` dans la feuille, qui réserve la colonne et y pose la fiche.
 */
export function MetierOverlay({ metier }: { metier: Metier }) {
  const fiche = FICHES[metier.fiche];

  return (
    <div className="rpg-lp-metier" data-fiche={fiche ? "" : undefined}>
      <FlowRow pieces={metier.chaine} etapes={etapesDe(metier)} avecFiche={!!fiche} />

      {fiche ? (
        <div className="rpg-lp-colonne-fiche">
          <ItemFiche fiche={fiche} />
        </div>
      ) : null}
    </div>
  );
}
