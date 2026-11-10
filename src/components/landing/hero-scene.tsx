import Image from "next/image";
import { CHIFFRES, EMBLEME, HERO } from "@/lib/landing/page";
import { BetaTrigger } from "./beta-trigger";
import { CompteARebours } from "./compte-a-rebours";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";
import { HeroShowcase } from "./hero-showcase";

/**
 * L'ouverture.
 *
 * Elle ne suit pas le gabarit des autres scènes, et c'est délibéré : le
 * texte au centre, en haut, puis quatre écrans du jeu en fondu. Le Marché
 * ouvre la série ; l'Ordre de bataille, la Forge et une arène lui succèdent.
 *
 * Les six chiffres passent sous la vitrine plutôt qu'en bandeau de compteurs.
 * Un encadré aurait fait une carte, et une carte est exactement ce que cette
 * page refuse d'être.
 */
export function HeroScene() {
  return (
    <Scene id="hero" className="is-hero">
      <SceneBackdrop sources={[HERO.fond]} cadrage="center 42%" priority />

      <div className="rpg-lp-inner">
        <div className="rpg-lp-hero-body">
          <p className="rpg-lp-hero-mark">
            <Image
              src={EMBLEME}
              alt=""
              width={1254}
              height={1254}
              priority
              className="rpg-lp-hero-emblem"
            />
            <span className="rpg-lp-hero-nom">Rakorn</span>
          </p>

          <p className="rpg-lp-hero-kicker">{HERO.surtitre}</p>

          <h1 className="rpg-lp-hero-title">
            {HERO.titre.map((mot, i) => (
              <span key={mot} className={i === 1 ? "rpg-lp-gold" : undefined}>
                {mot}
              </span>
            ))}
          </h1>

          <p className="rpg-lp-hero-lede">{HERO.texte}</p>

          {/* Juste au-dessus des boutons : c'est la réponse à la question que
              le premier pose — rejoindre, oui, mais pour quand ? */}
          <CompteARebours />

          <div className="rpg-lp-actions">
            <BetaTrigger className="rpg-lp-btn" ouvert="Entrer dans Rakorn">
              {HERO.action}
            </BetaTrigger>
            <a href="#metiers" className="rpg-lp-btn is-ghost">
              {HERO.actionSecondaire}
            </a>
          </div>
        </div>

        <HeroShowcase />

        <div className="rpg-lp-hero-foot">
          <ul className="rpg-lp-counts">
            {CHIFFRES.map((chiffre) => (
              <li key={chiffre.quoi}>
                <b>{chiffre.valeur}</b> {chiffre.quoi}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  );
}
