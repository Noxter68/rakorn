import { FINAL, JEU_URL } from "@/lib/landing/page";
import { Reveal } from "./reveal";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";
import { SceneCaption } from "./scene-caption";

/**
 * La clôture.
 *
 * Elle suit le gabarit des autres scènes : titre en bas à gauche, texte en bas
 * à droite. Elle a d'abord été centrée, comme l'ouverture — mais l'ouverture
 * peut se le permettre, elle n'a rien derrière elle ; une clôture centrée,
 * arrivant après sept scènes bâties sur la même ligne, se lit comme une page
 * d'un autre site. Le seul écart qu'elle garde, ce sont les deux boutons,
 * qu'on ne pouvait pas ranger ailleurs qu'au bout du texte.
 *
 * Ils y étaient posés en absolu, et sur un téléphone ils tombaient en travers
 * du titre. `is-pliable-etroit` les remet dans le flux, à leur place dans le
 * balisage : après le texte, avant le pied de page.
 */
export function FinalScene() {
  return (
    <Scene id="final" className="is-final is-pliable-etroit">
      <SceneBackdrop sources={[FINAL.fond]} cadrage="center 30%" />

      <div className="rpg-lp-inner">
        <SceneCaption
          surtitre={FINAL.surtitre}
          titre={FINAL.titre}
          accent={FINAL.accent}
          texte={FINAL.texte}
        />

        <Reveal delay={340} className="rpg-lp-final-actions">
          <a href={`${JEU_URL}/register`} className="rpg-lp-btn">
            {FINAL.action}
          </a>
          <a href={`${JEU_URL}/login`} className="rpg-lp-btn is-ghost">
            J&apos;ai déjà un compte
          </a>
        </Reveal>

        <footer className="rpg-lp-foot">
          <span>Rakorn</span>
          <span>Récolter, forger, vendre — et recommencer.</span>
        </footer>
      </div>
    </Scene>
  );
}
