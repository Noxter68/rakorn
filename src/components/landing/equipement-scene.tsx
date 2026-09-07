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
 */
export function EquipementScene() {
  return (
    <TabbedScene
      id="equipement"
      className="is-pierre is-centre is-pliable"
      onglets={ETAPES_FORGE}
      overlays={ETAPES_FORGE.map((etape) => (
        <ForgeOverlay key={etape.cle} etape={etape} />
      ))}
    />
  );
}
