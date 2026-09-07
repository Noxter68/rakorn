import { SALLES_MARCHE } from "@/lib/landing/marche";
import { TabbedScene } from "./tabbed-scene";

/**
 * Le marché : les quatre salles du jeu, en plein écran.
 *
 * La capture n'est plus posée en panneau au milieu de la scène mais sert de
 * décor : deux images l'une sur l'autre, dont une seule comptait. C'est aussi
 * la seule manière de la montrer assez grande pour qu'on y lise quelque chose.
 *
 * Les onglets font office de défileur. Ils sont déjà le geste de toute la
 * page — un mot, un trait — et ajouter des flèches de diaporama aurait
 * introduit une deuxième grammaire pour la même action.
 */
export function MarcheScene() {
  return <TabbedScene id="marche" className="is-captures" onglets={SALLES_MARCHE} />;
}
