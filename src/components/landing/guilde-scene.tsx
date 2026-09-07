"use client";

import Image from "next/image";
import { useState } from "react";
import { VOLETS_GUILDE } from "@/lib/landing/guilde";
import type { Piece } from "@/lib/landing/types";
import { Lightbox } from "./lightbox";
import { TabbedScene } from "./tabbed-scene";

/**
 * Les guildes : la cité qu'on finance, les huit expéditions qu'on mène.
 *
 * Les planches s'ouvrent au clic. Ce sont des tableaux peints — un hall de
 * guilde, une nécropole — et à dix rem de large on devine un lieu sans le
 * voir. C'est la seule section de la page où une image mérite qu'on s'arrête
 * dessus : ailleurs, ce sont des objets détourés, qui se lisent en vignette.
 */
export function GuildeScene() {
  const [ouverte, setOuverte] = useState<Piece | null>(null);

  return (
    <>
      <TabbedScene
        id="guilde"
        className="is-centre is-guilde is-pliable-etroit"
        onglets={VOLETS_GUILDE}
        overlays={VOLETS_GUILDE.map((volet) => (
          /* Quatre bâtiments ou huit expéditions : ce n'est pas la même
             rangée. La classe le dit, et la feuille de style en tire les
             colonnes — une seule pour la cité sur un téléphone, deux pour les
             expéditions, qui sont deux fois plus nombreuses. */
          <ul key={volet.cle} className={`rpg-lp-lieux ${volet.pieces.length > 4 ? "is-longue" : ""}`}>
            {volet.pieces.map((piece) => (
              <li key={piece.art}>
                <button
                  type="button"
                  className="rpg-lp-lieu"
                  onClick={() => setOuverte(piece)}
                  aria-label={`Agrandir : ${piece.nom}`}
                >
                  <span className="rpg-lp-lieu-art">
                    <Image
                      src={piece.art}
                      alt=""
                      fill
                      sizes="(min-width: 1400px) 320px, 22vw"
                      className="object-cover"
                    />
                    <span aria-hidden className="rpg-lp-lieu-loupe">
                      Agrandir
                    </span>
                  </span>
                  <span className="rpg-lp-lieu-nom">{piece.nom}</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      />

      <Lightbox
        ouvert={!!ouverte}
        onFermer={() => setOuverte(null)}
        art={ouverte?.art ?? ""}
        titre={ouverte?.nom ?? ""}
      />
    </>
  );
}
