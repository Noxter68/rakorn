import type { CSSProperties } from "react";
import { FREQUENTATION, JOUEURS, NOTE, SONDAGE, part, type Reponse } from "@/lib/landing/joueurs";
import { Reveal } from "./reveal";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";
import { SceneCaption } from "./scene-caption";

/**
 * Ceux qui jouent déjà.
 *
 * Dix scènes viennent de dire ce que le jeu contient ; celle-ci dit qu'on y
 * joue. Elle se tient juste avant la clôture, parce que c'est la question que
 * se pose qui hésite encore au moment de cliquer : est-ce qu'il y a du monde ?
 *
 * Trois chiffres en tête, gros, parce qu'ils répondent à cette question-là.
 * La note d'abord : l'avis des autres joueurs pèse plus qu'un effectif.
 * Puis ce qu'ils préfèrent, sous un filet d'or comme « Et encore », en barres
 * qui ne sont qu'un trait : la proportion se lit d'un coup d'œil, et le nombre
 * est écrit à côté pour qui veut le vérifier. Les neuf lignes se rangent sur
 * trois colonnes, dans l'ordre de lecture : sur une seule, à cette largeur,
 * chaque trait aurait traversé l'écran. Aucun cadre, aucun camembert.
 *
 * Aucun pourcentage n'est écrit à la main : les données sont des effectifs,
 * et la page calcule elle-même (`part`) — voir `lib/landing/joueurs.ts`.
 */
export function JoueursScene() {
  return (
    <Scene id="joueurs" className="is-joueurs is-pliable-etroit">
      <SceneBackdrop sources={[JOUEURS.fond]} cadrage="center 40%" />

      <div className="rpg-lp-inner">
        <ul className="rpg-lp-joueurs-tete">
          <Reveal as="li">
            <b>
              {NOTE}
              <small> / 5</small>
              {/* Cinq étoiles, remplies à la note : un dégradé à arrêt franc,
                  découpé par le texte. */}
              <span
                className="rpg-lp-etoiles"
                aria-hidden
                style={{ "--note": `${(SONDAGE.note / 5) * 100}%` } as CSSProperties}
              >
                ★★★★★
              </span>
            </b>
            <span className="rpg-lp-joueurs-quoi">note moyenne · {SONDAGE.reponses} avis</span>
          </Reveal>
          <Reveal as="li" delay={90}>
            <b>{FREQUENTATION.inscrits}</b>
            <span className="rpg-lp-joueurs-quoi">joueurs en deux semaines</span>
          </Reveal>
          <Reveal as="li" delay={180}>
            <b>{FREQUENTATION.actifs7j}</b>
            <span className="rpg-lp-joueurs-quoi">actifs ces 7 derniers jours</span>
          </Reveal>
        </ul>

        <Colonne titre="Ce qu'ils préfèrent" note="Plusieurs réponses possibles" reponses={SONDAGE.preferences} />

        <SceneCaption
          surtitre={JOUEURS.surtitre}
          titre={JOUEURS.titre}
          accent={JOUEURS.accent}
          texte={JOUEURS.texte}
          reperes={[`SONDAGE EN JEU · ${SONDAGE.reponses} RÉPONSES`, `CHIFFRES AU ${FREQUENTATION.releve.toUpperCase()}`]}
        />
      </div>
    </Scene>
  );
}

function Colonne({
  titre,
  note,
  reponses,
}: {
  titre: string;
  note?: string;
  reponses: Reponse[];
}) {
  return (
    <Reveal className="rpg-lp-sondage-col">
      <h3>{titre}</h3>
      <ul className="rpg-lp-barres">
        {reponses.map((reponse) => {
          const pct = part(reponse.effectif);
          return (
            <li key={reponse.libelle}>
              <span>{reponse.libelle}</span>
              <b>{pct} %</b>
              <span className="rpg-lp-barre" aria-hidden>
                <i style={{ width: `${pct}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
      {note ? <p>{note}</p> : null}
    </Reveal>
  );
}
