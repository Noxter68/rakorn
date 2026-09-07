import Image from "next/image";
import { EMBLEME, JEU_URL, NAVIGATION } from "@/lib/landing/page";

/**
 * La barre du haut, et la jauge qui court sous elle.
 *
 * Transparente au départ, elle ne se pose sur du verre qu'une fois le premier
 * écran passé — l'ouverture n'a rien à partager avec un bandeau opaque. Le
 * basculement se fait en CSS, sur un attribut que le `ScrollDirector` pose à
 * la racine : aucun rendu React ne traverse l'arbre pendant qu'on défile.
 *
 * La jauge s'anime en `scaleX` et non en largeur. Repeindre une largeur à
 * chaque image relance la mise en page du document ; une transformation ne
 * touche que la composition.
 */
export function Topnav() {
  return (
    <>
      <span id="rpg-lp-progress" className="rpg-lp-progress" aria-hidden />
      <nav className="rpg-lp-nav">
        <div className="rpg-lp-nav-inner">
          <a href="#hero" className="rpg-lp-nav-brand">
            <Image src={EMBLEME} alt="" width={1254} height={1254} className="rpg-lp-nav-emblem" />
            <span>Rakorn</span>
          </a>
          <div className="rpg-lp-nav-links">
            {NAVIGATION.map((lien) => (
              <a key={lien.href} href={lien.href}>
                {lien.libelle}
              </a>
            ))}
          </div>
          <a href={`${JEU_URL}/register`} className="rpg-lp-nav-play">
            Jouer
          </a>
        </div>
      </nav>
    </>
  );
}
