import { METIERS } from "@/lib/landing/metiers";
import { MetierOverlay } from "./metier-overlay";
import { TabbedScene } from "./tabbed-scene";

/**
 * Les huit métiers.
 *
 * Huit onglets, et à chaque fois quatre objets qui disent, sans une phrase,
 * comment on joue : on récolte, on fabrique, on vend ou l'on commande, et
 * l'on vise la pièce qui couronne le métier. Le texte explique le métier ;
 * les objets prouvent qu'il existe ; la fiche, à droite, dit ce qu'il vaut.
 *
 * `is-fiche` donne à la scène sa colonne de droite, où la fiche prend toute la
 * hauteur ; `is-pliable` lui dit qu'elle sait se dérouler en colonne sur un
 * écran étroit. C'est la feuille de style qui décide quand — voir « Les écrans
 * étroits ».
 */
export function MetiersScene() {
  return (
    <TabbedScene
      id="metiers"
      className="is-pierre is-centre is-pliable is-fiche"
      onglets={METIERS}
      overlays={METIERS.map((metier) => (
        <MetierOverlay key={metier.cle} metier={metier} />
      ))}
    />
  );
}
