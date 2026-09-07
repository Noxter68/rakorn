import Image from "next/image";
import { REGLE_COMBAT, type Tactique } from "@/lib/landing/combat";

/**
 * Une approche, et les quatre coups qui la servent — en rotation.
 *
 * Deux colonnes de deux disaient « en voici quatre ». Un cercle où l'on passe
 * de l'un à l'autre dit **comment on joue** : une action par tour, quatre tours
 * pour boucler, et des recharges qui décident si le tour d'après peut rejouer
 * le premier coup. C'est la même donnée, lue dans le sens du jeu.
 *
 * Les tours et les recharges ne sont pas décoratifs. `TOUR 01` est la place du
 * coup dans la boucle ; `CD 3` est sa recharge réelle, relevée dans
 * `abilities.ts`. Les lire côte à côte, c'est voir tout de suite qu'une chaîne
 * dont le dernier coup se recharge en six tours ne se rejoue pas au cinquième.
 *
 * Le cercle et ses quatre pointes sont un SVG décoratif — `aria-hidden`, aucun
 * texte dedans. Ce qu'il y a à lire est dans les nœuds, en HTML, dans l'ordre
 * de la rotation.
 *
 * La règle du jeu vivait à gauche, sur le premier onglet seulement, et laissait
 * un trou de la moitié de l'écran sur les trois autres. Elle ferme maintenant
 * le panneau de droite, où elle est sur les quatre.
 */

/** L'ordre des coups est celui de la rotation : haut, droite, bas, gauche. */
const PLACES = ["haut", "droite", "bas", "gauche"] as const;

/** Les quatre pointes, à mi-chemin de chaque quart, dans le sens horaire. */
const POINTES = [45, 135, 225, 315];

export function TactiqueOverlay({ tactique }: { tactique: Tactique }) {
  const recharges = tactique.coups.map((coup) => coup.recharge);
  const niveaux = tactique.coups.map((coup) => coup.niveau);

  return (
    <div className="rpg-lp-combat">
      <div className="rpg-lp-rotation">
        <svg className="rpg-lp-rotation-anneau" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="49" />
          {/* Une seule pointe dessinée, tournée quatre fois : elle est écrite
              au sommet du cercle et regarde vers la droite, si bien qu'une
              rotation de son angle la pose sur l'arc et dans le bon sens.
              Pleine et non tracée — à cette taille, un chevron de deux traits
              se lit comme une équerre, pas comme une flèche. */}
          {POINTES.map((angle) => (
            <path key={angle} d="M 46.6 -2 L 51.4 1 L 46.6 4 Z" transform={`rotate(${angle} 50 50)`} />
          ))}
        </svg>

        <div className="rpg-lp-rotation-coeur">
          {/* L'emblème des lames croisées, et non deux copies d'une même épée
              inclinées l'une vers l'autre : c'est ce que faisait ce cœur, et
              les deux exemplaires se recouvraient en gardant chacun sa lumière
              du même côté — deux ombres portées dans la même direction sur des
              lames censées se croiser. Le dessin du jeu croise vraiment les
              siennes, et il est éclairé pour ça. */}
          <span className="rpg-lp-rotation-lames" aria-hidden>
            <Image
              src="/game/UI/pages/inventaire/sections/cross-epee.avif"
              alt=""
              width={1024}
              height={1536}
            />
          </span>
          <span className="rpg-lp-rotation-chaine">{tactique.chaine}</span>
        </div>

        {tactique.coups.map((coup, i) => (
          <div key={coup.art} className={`rpg-lp-rota-coup is-${PLACES[i]}`}>
            <span className="rpg-lp-rota-art">
              <Image src={coup.art} alt="" fill sizes="130px" className="object-contain" />
            </span>
            <span className="rpg-lp-rota-texte">
              <span className="rpg-lp-rota-tour">
                {`Tour 0${i + 1}`}
                <i aria-hidden />
                {`CD ${coup.recharge}`}
              </span>
              <b>{coup.nom}</b>
              <span className="rpg-lp-rota-effet">{coup.effet}</span>
            </span>
          </div>
        ))}
      </div>

      <aside className="rpg-lp-rota-panneau">
        <span className="rpg-lp-rota-bandeau" aria-hidden>
          <Image src={tactique.carte} alt="" fill sizes="340px" className="object-cover" />
        </span>
        <h3>Rotation {tactique.onglet.toLowerCase()}</h3>
        <ul>
          <li>
            <span className="rpg-lp-rota-ico">
              <Image
                src="/game/UI/pages/inventaire/sections/defense.avif"
                alt=""
                fill
                sizes="30px"
                className="object-contain"
              />
            </span>
            5 compétences emportées sur 22
          </li>
          <li>
            <span className="rpg-lp-rota-ico">
              <Image
                src="/game/UI/pages/inventaire/sections/recyclage.avif"
                alt=""
                fill
                sizes="30px"
                className="object-contain"
              />
            </span>
            Recharges de {Math.min(...recharges)} à {Math.max(...recharges)} tours
          </li>
          <li>
            <span className="rpg-lp-rota-ico">
              <Image src="/game/UI/icons/xp.avif" alt="" fill sizes="30px" className="object-contain" />
            </span>
            Ouvertes du niveau {Math.min(...niveaux)} au {Math.max(...niveaux)}
          </li>
        </ul>
        <p>{REGLE_COMBAT}</p>
      </aside>
    </div>
  );
}
