import Image from "next/image";
import { CHIFFRES, EMBLEME, HERO } from "@/lib/landing/page";
import { BetaTrigger } from "./beta-trigger";
import { CompteARebours } from "./compte-a-rebours";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";

/**
 * L'ouverture.
 *
 * Elle ne suit pas le gabarit des autres scènes, et c'est délibéré : le
 * texte au centre, en haut, et sous lui **le jeu** — le Marché, en vitrine,
 * comme on montre un produit. On lisait une promesse sur un paysage, et la
 * première capture n'arrivait qu'à la troisième scène : on pouvait décider de
 * s'inscrire sans avoir vu à quoi le jeu ressemble.
 *
 * Le Marché plutôt qu'un autre écran, parce que c'est lui qui prouve la
 * phrase du dessus : une liste de prix posés par des joueurs.
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
            <BetaTrigger className="rpg-lp-btn">{HERO.action}</BetaTrigger>
            <a href="#metiers" className="rpg-lp-btn is-ghost">
              {HERO.actionSecondaire}
            </a>
          </div>
        </div>

        <figure className="rpg-lp-hero-vitrine">
          <span className="rpg-lp-hero-ecran">
            {/* Servie telle quelle, comme les décors : c'est déjà un AVIF à
                la taille voulue, et un second encodage avec perte sur du
                texte d'interface ne rendrait rien de plus net. */}
            <Image
              src={HERO.capture}
              alt={HERO.captureAlt}
              width={2560}
              height={1323}
              priority
              unoptimized
              draggable={false}
            />
          </span>
        </figure>

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
