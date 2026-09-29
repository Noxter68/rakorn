import Image from "next/image";
import type { Piece } from "@/lib/landing/types";

/**
 * La boucle du jeu, en quatre temps et quatre objets.
 *
 * Récolter, fabriquer, échanger, et une quatrième marche qui dépend du métier.
 * C'est le seul endroit de la page où l'on explique comment on joue, et ça se
 * lit sans une phrase : quatre illustrations de même taille, quatre verbes,
 * trois chevrons entre elles.
 *
 * Les trois premiers verbes sont les mêmes pour les huit métiers ; seuls les
 * objets changent. C'est ce qui fait comprendre que la règle est commune, et
 * que le métier n'est qu'une manière de l'habiter.
 *
 * **Le dernier temps est celui que la fiche montre.** Son nom passe en or : la
 * fiche vit dans la colonne de droite, et rien d'autre ne dirait laquelle des
 * quatre pièces elle détaille. Le survol l'avance d'un cran — le lien se joue
 * en CSS, au niveau de la scène, sans état ni écouteur ; c'est `:has()` qui
 * fait le travail, et le `tabindex` ouvre le même geste au clavier via
 * `:focus-within`.
 */
export function FlowRow({
  pieces,
  etapes,
  avecFiche,
}: {
  pieces: Piece[];
  /** Le verbe de chaque marche, dans l'ordre des pièces. */
  etapes: string[];
  avecFiche?: boolean;
}) {
  return (
    <ol className="rpg-lp-flow">
      {pieces.map((piece, i) => {
        const lie = i === pieces.length - 1 && !!avecFiche;
        return (
          <li
            key={piece.art}
            className={`rpg-lp-flow-step ${lie ? "has-tip is-lie" : ""}`}
            tabIndex={lie ? 0 : undefined}
          >
            <span className="rpg-lp-flow-art">
              <Image
                src={piece.art}
                alt=""
                fill
                sizes="(min-width: 1400px) 224px, (min-width: 1000px) 176px, 26vw"
                className="object-contain"
              />
            </span>
            <span className="rpg-lp-flow-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="rpg-lp-flow-titre">{etapes[i]}</span>
            <span className="rpg-lp-flow-item">{piece.nom}</span>
          </li>
        );
      })}
    </ol>
  );
}
