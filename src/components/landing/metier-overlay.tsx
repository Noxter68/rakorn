import { FICHES } from "@/lib/landing/fiches";
import type { Metier } from "@/lib/landing/metiers";
import { FlowRow } from "./flow-row";
import { ItemFiche } from "./item-fiche";
import { MetierReseau } from "./metier-reseau";

/**
 * Un métier : son réseau en haut, la boucle du jeu en bas, sa fiche à droite.
 *
 * Trois étages qui répondent à trois questions dans l'ordre où elles se posent.
 * *Avec qui travaille-t-il ?* — le cercle et ses quatre fils. *Que fait-on,
 * concrètement ?* — les quatre temps, récolter, fabriquer, échanger, compléter.
 * *Et ça donne quoi ?* — la fiche du jeu, à droite, avec ses chiffres.
 *
 * **La fiche ne s'ouvre plus au survol : elle est là.** Elle attendait un geste
 * que personne ne faisait — un mot doré sous une illustration ne suffit pas à
 * annoncer qu'on cache la seule chose qui réponde à « qu'est-ce que ça vaut ».
 * Le survol de la dernière case ne l'ouvre donc plus, il l'avance : elle
 * grandit d'un cran et son cadre s'éclaire. Le geste est récompensé au lieu
 * d'être exigé.
 *
 * Les trois étages sont posés en absolu et non empilés en colonne. Le réseau
 * prend toute la largeur, la rangée seulement la gauche, et la fiche passe
 * sous le bras droit du cercle : trois boîtes qui se chevauchent en hauteur
 * mais jamais au même endroit. Une colonne aurait réservé à la fiche une
 * bande vide sur toute la hauteur — le tiers droit de la scène perdu pour
 * qu'un seul étage sur trois en ait l'usage.
 */
export function MetierOverlay({ metier }: { metier: Metier }) {
  const fiche = FICHES[metier.fiche];

  return (
    <div className="rpg-lp-metier">
      <MetierReseau metier={metier} />

      <div className="rpg-lp-metier-boucle">
        <FlowRow pieces={metier.chaine} avecFiche={!!fiche} />
      </div>

      {fiche ? (
        <div className="rpg-lp-metier-fiche">
          <ItemFiche fiche={fiche} />
        </div>
      ) : null}
    </div>
  );
}
