import { VUES_CONQUETE } from "@/lib/landing/conquete";
import { TabbedScene } from "./tabbed-scene";

/**
 * La conquête du royaume.
 *
 * Même traitement que la galerie et le marché : la capture est le décor, et
 * rien ne flotte par-dessus. Ce que la section a à démontrer — qu'une carte
 * change de couleur selon qui la tient, qu'un siège monte au rouge, qu'un
 * territoire porte ses bonus sur sa fiche — est déjà dans l'écran ; une
 * surimpression ne ferait que cacher la partie de la carte qui le dit.
 *
 * Pas de défilement automatique : chaque vue se lit avec son texte, et une
 * carte qui change toute seule sous les yeux de quelqu'un qui est en train de
 * lire la légende lui retire ce qu'il regardait.
 */
export function ConqueteScene() {
  return <TabbedScene id="conquete" className="is-captures is-conquete" onglets={VUES_CONQUETE} />;
}
