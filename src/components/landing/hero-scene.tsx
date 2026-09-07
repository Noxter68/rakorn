import Image from "next/image";
import { CHIFFRES, EMBLEME, HERO, JEU_URL } from "@/lib/landing/page";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";

/**
 * L'ouverture.
 *
 * Elle ne suit pas le gabarit des autres scènes, et c'est délibéré : ici le
 * titre est au centre gauche et non en bas, parce qu'il n'y a rien d'autre à
 * regarder que lui et le monde derrière. Les scènes suivantes ont quelque
 * chose à montrer — elles rendent donc le milieu de l'écran.
 *
 * Les six chiffres passent en pied de page plutôt qu'en bandeau de compteurs.
 * Un encadré aurait fait une carte, et une carte est exactement ce que cette
 * page refuse d'être.
 *
 * Deux paragraphes, dans cet ordre : ce que le jeu **est**, puis ce qui le
 * distingue. L'ouverture n'annonçait que le second — une bonne accroche pour
 * qui sait déjà de quel genre de jeu on parle, et rien du tout pour qui
 * arrive.
 */
export function HeroScene() {
  return (
    <Scene id="hero" className="is-hero">
      <SceneBackdrop sources={[HERO.fond]} cadrage="center 38%" priority />

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

          <div className="rpg-lp-hero-lede">
            {HERO.texte.map((phrase) => (
              <p key={phrase.slice(0, 24)}>{phrase}</p>
            ))}
          </div>

          <div className="rpg-lp-actions">
            <a href={`${JEU_URL}/register`} className="rpg-lp-btn">
              {HERO.action}
            </a>
            <a href="#metiers" className="rpg-lp-btn is-ghost">
              {HERO.actionSecondaire}
            </a>
          </div>
        </div>

        <div className="rpg-lp-hero-foot">
          <ul className="rpg-lp-counts">
            {CHIFFRES.map((chiffre) => (
              <li key={chiffre.quoi}>
                <b>{chiffre.valeur}</b> {chiffre.quoi}
              </li>
            ))}
          </ul>
          <span className="rpg-lp-hero-hint">Faites défiler</span>
        </div>
      </div>
    </Scene>
  );
}
