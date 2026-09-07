import Image from "next/image";
import type { Metier } from "@/lib/landing/metiers";

/**
 * Le métier au centre, et les quatre voisins qui vivent de lui.
 *
 * C'est le cœur de la scène et sa raison d'être : huit métiers alignés côte à
 * côte auraient dit « il y en a huit », quand ce qu'il faut faire comprendre
 * est qu'aucun ne se suffit à lui-même. Un cercle et quatre fils le disent en
 * une image, sans une phrase.
 *
 * **Les fils sont un SVG, et un seul.** Quatre traits posés en bordures CSS
 * auraient demandé quatre rotations réglées à l'œil, qui se décalent au
 * premier changement de largeur. Le SVG raisonne en coordonnées de sa propre
 * boîte : les quatre courbes partent du centre et arrivent aux quatre coins
 * quelle que soit la taille rendue, et la sortie s'y adapte sans qu'aucune
 * valeur soit à reprendre.
 *
 * Il est décoratif — `aria-hidden`, aucun texte dedans. Ce qu'il y a à lire
 * est dans les nœuds, en HTML, et un lecteur d'écran les trouve dans l'ordre
 * où ils sont écrits.
 *
 * Au survol d'un voisin, son fil s'allume et les trois autres s'assourdissent :
 * c'est la seule façon de montrer qu'il y a **quatre** relations distinctes et
 * non un halo. Tout se joue en CSS — voir `:has()` dans la feuille.
 */

/** L'ordre des voisins décide de leur place : les quatre coins, dans cet ordre. */
const COINS = ["hg", "bg", "hd", "bd"] as const;

export function MetierReseau({ metier }: { metier: Metier }) {
  return (
    <div className="rpg-lp-reseau">
      <svg
        className="rpg-lp-reseau-fils"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Quatre courbes qui s'écartent de l'anneau avant de rejoindre leur
            nœud : une droite aurait donné un organigramme, et c'est
            précisément ce que la scène ne doit pas être.

            Elles partent du **bord de l'anneau** et non du centre de la boîte.
            L'anneau est au premier quart de la hauteur, pas au milieu : la
            nature morte occupe le haut, le nom et le socle le bas. Des fils
            partis du milieu traversaient le nom du métier. */}
        <path className="is-hg" d="M 43 24 C 36 21 34 19 25 19" />
        <path className="is-bg" d="M 43 29 C 36 42 33 74 25 74" />
        <path className="is-hd" d="M 57 24 C 64 21 66 19 75 19" />
        <path className="is-bd" d="M 57 29 C 64 42 67 74 75 74" />
      </svg>

      <div className="rpg-lp-reseau-centre">
        <span className="rpg-lp-reseau-anneau" aria-hidden />
        <span className="rpg-lp-reseau-portrait">
          <Image
            src={metier.portrait}
            alt=""
            fill
            sizes="(min-width: 1400px) 300px, 22vw"
            className="object-contain"
          />
        </span>
        <h3 className="rpg-lp-reseau-nom">{metier.onglet}</h3>
        <ul className="rpg-lp-reseau-socle">
          {metier.socle.map((ligne) => (
            <li key={ligne}>{ligne}</li>
          ))}
        </ul>
      </div>

      {metier.liens.map((lien, i) => (
        <div key={lien.nom} className={`rpg-lp-noeud is-${COINS[i]}`}>
          <span className="rpg-lp-noeud-art">
            <Image
              src={lien.art}
              alt=""
              fill
              sizes="(min-width: 1400px) 96px, 8vw"
              className="object-contain"
            />
          </span>
          <span className="rpg-lp-noeud-texte">
            <b>{lien.nom}</b>
            <span>{lien.role}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
