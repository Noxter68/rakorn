import { TACTIQUES } from "@/lib/landing/combat";
import { TabbedScene } from "./tabbed-scene";
import { TactiqueOverlay } from "./tactique-overlay";

/** Le combat : quatre manières d'entrer, quatre coups pour chacune. */
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
