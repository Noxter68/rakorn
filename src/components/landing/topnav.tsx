import Image from "next/image";
import { EMBLEME, NAVIGATION } from "@/lib/landing/page";
import { BetaTrigger } from "./beta-trigger";
import { DiscordLink } from "./discord-link";
import { NavBrand } from "./nav-brand";

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
          <NavBrand>
            <Image src={EMBLEME} alt="" width={1254} height={1254} className="rpg-lp-nav-emblem" />
            <span>Rakorn</span>
          </NavBrand>
          <div className="rpg-lp-nav-links">
            {NAVIGATION.map((lien) => (
              <a key={lien.href} href={lien.href}>
                {lien.libelle}
              </a>
            ))}
          </div>
          {/* Le seul bouton de la barre descend au formulaire, en bas de page.
              Il a porté le mot « jouer » tant qu'on a cru ouvrir tout de
              suite ; ce mot est plus fort que celui-ci, et c'est exactement le
              problème — il promettait une partie, et on n'a qu'un champ à
              offrir. « S'inscrire » plutôt que le « Rejoindre la bêta » des
              deux autres appels : la barre porte déjà sept liens, et c'est le
              seul endroit de la page où trois mots en coûteraient un.

              Le serveur Discord le précède, en icône seule, pour la même
              raison : un mot de plus n'y tiendrait pas, et cette marque-là se
              reconnaît sans lui. Les deux sont groupés pour que la barre
              garde ses trois blocs — marque, liens, gestes — et que le
              `justify-between` ne se mette pas à répartir quatre enfants. */}
          <div className="rpg-lp-nav-actions">
            <DiscordLink className="rpg-lp-nav-discord" />
            <BetaTrigger className="rpg-lp-nav-play">S&apos;inscrire</BetaTrigger>
          </div>
        </div>
      </nav>
    </>
  );
}
