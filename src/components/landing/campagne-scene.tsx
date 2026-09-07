"use client";

import Image from "next/image";
import { useState } from "react";
import { BOSS, OUVERTURE } from "@/lib/landing/campagne";
import { BossPanel } from "./boss-panel";
import { Reveal } from "./reveal";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";

/**
 * La Route du Voyageur.
 *
 * Seule scène de la page à ne pas suivre le gabarit commun : elle reprend la
 * disposition de l'écran de campagne du jeu — titre en haut à gauche, rangée
 * de chapitres en bas, panneau de détail à droite. Montrer un écran de jeu
 * dans sa propre disposition en dit plus qu'un texte qui le décrirait dans une
 * autre, et c'est la seule section où la vitrine a quelque chose à copier
 * plutôt qu'à inventer.
 *
 * Choisir un boss change le décor : les cinq zones se relaient en fondu comme
 * les huit décors des métiers le faisaient avant. C'est le seul mouvement de
 * la scène, et il suffit.
 *
 * `is-pliable-etroit` la fait sortir de cette disposition quand l'écran ne la porte
 * plus : le panneau du boss et la rangée de chapitres se disputaient les mêmes
 * deux cents pixels sur une tablette, et le titre disparaissait sous le
 * panneau. Dépliée, elle se lit dans son ordre — la route, le boss choisi, les
 * chapitres.
 *
 * Pas de défilement automatique ici, contrairement à la version précédente.
 * Une rangée de cartes qu'on peut cliquer se donne comme un choix ; la voir
 * changer toute seule pendant qu'on hésite reprend ce choix à celui qui allait
 * le faire.
 */
export function CampagneScene() {
  const [actif, setActif] = useState(0);
  const boss = BOSS[actif];

  return (
    <Scene id="campagne" className="is-campagne is-pliable-etroit">
      <SceneBackdrop sources={BOSS.map((b) => b.fond)} active={actif} />

      <div className="rpg-lp-inner">
        <div className="rpg-lp-route">
          <Reveal as="p" className="rpg-lp-kicker">
            {OUVERTURE.surtitre}
          </Reveal>
          <Reveal delay={100}>
            <h2 className="rpg-lp-title">
              {OUVERTURE.titre}
              <br />
              <span className="rpg-lp-gold">{OUVERTURE.accent}</span>
            </h2>
          </Reveal>
          <Reveal as="p" delay={200} className="rpg-lp-desc">
            {OUVERTURE.texte}
          </Reveal>
          <Reveal delay={300}>
            <ul className="rpg-lp-route-chiffres">
              {OUVERTURE.chiffres.map((chiffre) => (
                <li key={chiffre.quoi}>
                  <b>{chiffre.valeur}</b>
                  <span>{chiffre.quoi}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* La clé rejoue l'entrée du panneau à chaque changement : sans elle,
            React réutilise les mêmes nœuds et les chiffres sautent d'un coup
            sec au milieu d'un décor qui, lui, se fond. */}
        <div key={boss.cle} className="rpg-lp-boss-swap">
          <BossPanel boss={boss} />
        </div>

        <ul className="rpg-lp-chapitres">
          {BOSS.map((entree, i) => (
            <li key={entree.cle}>
              <button
                type="button"
                aria-pressed={i === actif}
                className={`rpg-lp-chapitre ${i === actif ? "is-on" : ""}`}
                onClick={() => setActif(i)}
              >
                <span className="rpg-lp-chapitre-art">
                  <Image
                    src={entree.art}
                    alt=""
                    fill
                    sizes="(min-width: 1400px) 200px, 15vw"
                    className="object-cover"
                  />
                  {/* Le losange du niveau, à cheval sur le bord bas de la
                      carte, comme la bande de créatures du jeu le pose. */}
                  <span className="rpg-lp-chapitre-niv">{entree.niveau}</span>
                </span>
                <span className="rpg-lp-chapitre-nom">{entree.nom}</span>
                <span className="rpg-lp-chapitre-zone">{entree.chapitre}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
