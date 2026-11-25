import { TACTIQUES } from "@/lib/landing/combat";
import { TabbedScene } from "./tabbed-scene";
import { TactiqueOverlay } from "./tactique-overlay";

/** Le combat : les quatre familles de techniques du jeu, quatre coups pour chacune. */
export function CombatScene() {
  return (
    <TabbedScene
      id="combat"
      className="is-centre is-combat is-pliable"
      onglets={TACTIQUES}
      overlays={TACTIQUES.map((tactique) => (
        <TactiqueOverlay key={tactique.cle} tactique={tactique} />
      ))}
    />
  );
}
