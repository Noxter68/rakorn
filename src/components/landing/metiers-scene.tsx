import { METIERS } from "@/lib/landing/metiers";
import { MetierOverlay } from "./metier-overlay";
import { TabbedScene } from "./tabbed-scene";

/**
 * Les huit métiers.
 *
 * C'est la scène pour laquelle la page a été bâtie ainsi : huit décors qui se
 * relaient en fondu, et à chaque fois quatre objets qui disent, sans une
 * phrase, ce qu'on peut fabriquer. Le texte explique le métier ; les objets
 * prouvent qu'il existe.
 *
 * `is-pliable` dit que la scène sait quitter le gabarit à bandes — onglets en
 * haut, démonstration au milieu, titre en bas — pour se dérouler en colonne.
 * C'est la feuille de style qui décide quand ; voir « Les écrans étroits ».
 */
export function MetiersScene() {
  return (
    <TabbedScene
      id="metiers"
      className="is-pierre is-centre is-pliable"
      onglets={METIERS}
      overlays={METIERS.map((metier) => (
        <MetierOverlay key={metier.cle} metier={metier} />
      ))}
    />
  );
}
