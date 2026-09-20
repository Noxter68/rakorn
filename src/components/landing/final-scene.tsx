import { DISCORD, FINAL } from "@/lib/landing/page";
import { BetaTrigger } from "./beta-trigger";
import { DiscordLink } from "./discord-link";
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
 * d'un autre site. Le seul écart qu'elle garde, c'est le dernier appel, qu'on
 * ne pouvait pas ranger ailleurs qu'au bout du texte : c'est là qu'on a fini
 * de lire, et donc le seul endroit où la question se pose d'elle-même.
 *
 * Le champ, lui, a essayé de tenir ici avant de partir dans la fenêtre. Sur
 * une vallée de nuit, un champ de saisie n'a aucun contraste à emprunter : il
 * était là, mesurable dans le DOM, et invisible à l'œil.
 *
 * Il y était posé en absolu, et sur un téléphone il tombait en travers du
 * titre. `is-pliable-etroit` le remet dans le flux, à sa place dans le
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
          <BetaTrigger className="rpg-lp-btn">{FINAL.action}</BetaTrigger>
        </Reveal>

        {/* Trois blocs : la marque, la devise, le serveur. La devise s'efface
            sur téléphone, où elle ne tiendrait pas ; le lien, lui, reste — au
            bout d'une page qu'on vient de lire, c'est le seul geste possible
            en dehors du formulaire. */}
        <footer className="rpg-lp-foot">
          <span>Rakorn</span>
          <span className="rpg-lp-foot-devise">Récolter, forger, vendre — et recommencer.</span>
          <DiscordLink className="rpg-lp-foot-discord">
            <span>{DISCORD.libelle}</span>
          </DiscordLink>
        </footer>
      </div>
    </Scene>
  );
}
