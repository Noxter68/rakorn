import { ETAPES_FORGE } from "@/lib/landing/equipement";
import { ForgeOverlay } from "./forge-overlay";
import { TabbedScene } from "./tabbed-scene";

/**
 * Le trajet d'une pièce : forgée, traitée, sertie, portée.
 *
 * Quatre onglets, et chacun dit ce que la chose fait. La version précédente
 * montrait quatre illustrations et leur nom : on voyait de belles pièces sans
 * savoir si elles étaient bonnes. Une vitrine de jeu d'équipement qui
 * n'affiche aucune statistique n'annonce rien.
 *
 * `is-fiche` lui donne la colonne de droite, où la fiche d'une pièce — ou,
 * au sertissage, ce qu'est une châsse — prend toute la hauteur de la scène.
 * Les traitements, qui n'ont pas de fiche, la rendent à leur rangée.
 */
export function EquipementScene() {
  return (
    <TabbedScene
      id="equipement"
      className="is-pierre is-centre is-pliable is-fiche"
      onglets={ETAPES_FORGE}
      overlays={ETAPES_FORGE.map((etape) => (
        <ForgeOverlay key={etape.cle} etape={etape} />
      ))}
    />
  );
}
