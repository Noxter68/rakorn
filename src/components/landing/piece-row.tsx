import Image from "next/image";
import type { Piece } from "@/lib/landing/types";

/**
 * Une rangée de pièces, posée par-dessus le décor.
 *
 * Toutes à la même taille, toujours. Une version antérieure les faisait
 * croître de gauche à droite pour figurer une montée en valeur : l'œil lisait
 * alors une hiérarchie là où il n'y en a pas — un entrepôt ne vaut pas moins
 * qu'une citadelle, une gemme bleue pas moins qu'une rouge.
 *
 * Deux natures de planches, donc deux traitements. Les objets d'inventaire
 * sont détourés sur fond noir : ils se posent à même la scène, sans cadre. Les
 * bâtiments et les lieux sont des tableaux peints, fond compris : sans masque
 * ils montrent leur rectangle et se lisent comme des vignettes collées.
 *
 * Au-delà de quatre pièces la rangée passe à la ligne — les huit expéditions
 * tiennent en deux rangs de quatre plutôt qu'en une file de huit vignettes
 * réduites à rien.
 */
export function PieceRow({
  pieces,
  mode = "detoure",
  taille = "normale",
}: {
  pieces: Piece[];
  /** `peint` ajoute le masque : la planche a son propre fond. */
  mode?: "detoure" | "peint";
  taille?: "normale" | "grande";
}) {
  const peint = mode === "peint";

  return (
    <ul className={`rpg-lp-row is-${mode} is-${taille}`}>
      {pieces.map((piece) => (
        <li key={piece.art} className="rpg-lp-row-item">
          <span className="rpg-lp-row-art">
            <Image
              src={piece.art}
              alt=""
              fill
              sizes="(min-width: 1400px) 260px, (min-width: 1000px) 200px, 30vw"
              className={peint ? "rpg-lp-feather object-cover" : "object-contain"}
            />
          </span>
          {piece.palier ? <span className="rpg-lp-row-palier">{piece.palier}</span> : null}
          <span className="rpg-lp-row-nom">{piece.nom}</span>
        </li>
      ))}
    </ul>
  );
}
