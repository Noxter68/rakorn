import { ECRANS } from "@/lib/landing/apercu";
import { TabbedScene } from "./tabbed-scene";

/**
 * La galerie d'écrans.
 *
 * Même traitement que le marché : la capture *est* le décor, et les onglets, le
 * titre et le texte se posent dessus. C'est la seule disposition qui laisse un
 * écran de jeu se lire — en panneau flottant, il faudrait le réduire de moitié,
 * et une interface réduite de moitié n'est plus qu'une texture.
 *
 * Huit sections racontent des systèmes ; celle-ci ne raconte rien et se
 * contente de montrer. Elle vient donc en dernier, juste avant qu'on demande
 * au visiteur de décider.
 */
export function ApercuScene() {
  return <TabbedScene id="apercu" className="is-captures" onglets={ECRANS} />;
}
