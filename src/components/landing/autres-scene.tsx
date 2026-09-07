import Image from "next/image";
import { AUTRES } from "@/lib/landing/page";
import { Reveal } from "./reveal";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";
import { SceneCaption } from "./scene-caption";

/**
 * La seule scène où plusieurs choses paraissent ensemble.
 *
 * Elle existe parce qu'il reste huit sujets qui méritent une ligne et pas une
 * scène, et l'alternative aurait été huit scènes de plus — ou huit sujets
 * passés sous silence. Une exception assumée tient ; huit exceptions auraient
 * fait de la page ce qu'elle refuse d'être.
 *
 * Aucun cadre : un filet d'or en haut de chaque colonne, et c'est tout. C'est
 * ce qui la distingue d'une grille de cartes — les entrées se lisent comme des
 * colonnes de journal, pas comme des tuiles à cliquer.
 *
 * L'icône est passée sur la ligne du titre. Elle tenait la sienne, avec deux
 * centimètres de vide sous elle : trois étages pour deux informations, et la
 * phrase — la seule qui apprenne quelque chose — s'y retrouvait la plus petite
 * des trois. Elle est maintenant la plus lisible.
 */
export function AutresScene() {
  return (
    <Scene id="autres" className="is-autres is-pliable-etroit">
      <SceneBackdrop sources={[AUTRES.fond]} />

      <div className="rpg-lp-inner">
        <ul className="rpg-lp-others">
          {AUTRES.entrees.map((entree, i) => (
            <Reveal as="li" key={entree.nom} delay={(i % 4) * 90}>
              <span className="rpg-lp-others-tete">
                <Image
                  src={entree.art}
                  alt=""
                  width={44}
                  height={44}
                  className="rpg-lp-others-ico"
                />
                <h3>{entree.nom}</h3>
              </span>
              <p>{entree.texte}</p>
            </Reveal>
          ))}
        </ul>

        <SceneCaption
          surtitre={AUTRES.surtitre}
          titre={AUTRES.titre}
          accent={AUTRES.accent}
          texte={AUTRES.texte}
        />
      </div>
    </Scene>
  );
}
