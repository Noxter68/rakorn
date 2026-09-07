"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { VOLETS_CARTE } from "@/lib/landing/carte";
import { TabbedScene } from "./tabbed-scene";

/**
 * La carte interactive, et les trois choses qui s'y passent.
 *
 * ── Ce que la surimpression doit démontrer ────────────────────────────────
 *
 * Pas une capture d'écran de plus : le **rythme**. Les autres sections
 * montrent ce qu'on fabrique, ce qu'on porte, qui on affronte — des choses
 * qu'une image dit très bien. La carte, elle, se distingue par le fait qu'elle
 * change toute seule, et une image ne sait pas dire « toutes les deux heures ».
 *
 * D'où le cartouche : l'emblème du losange tel qu'il se pose sur la carte du
 * jeu, l'horloge en grand juste dessous, et trois lignes de règles. C'est la
 * seule surimpression de la page qui porte du texte plutôt qu'une illustration,
 * et c'est parce que son sujet est une mécanique et non un objet.
 *
 * ── La teinte vient de la vignette ────────────────────────────────────────
 *
 * Rouge pour les placards, ambre pour les chantiers, vert d'eau pour les
 * coffres — les mêmes couleurs qu'en jeu, relevées dans les dessins eux-mêmes.
 * Un visiteur qui aura vu cette section reconnaîtra les losanges à la couleur
 * avant d'avoir lu leur nom.
 */
export function CarteScene() {
  return (
    <TabbedScene
      id="carte"
      className="is-centre is-carte is-pliable-etroit"
      onglets={VOLETS_CARTE}
      overlays={VOLETS_CARTE.map((volet) => (
        <div
          key={volet.cle}
          className="rpg-lp-carte-fiche"
          style={{ "--teinte": volet.teinte } as CSSProperties}
        >
          <span className="rpg-lp-carte-embleme" aria-hidden>
            <Image src={volet.embleme} alt="" width={128} height={128} />
          </span>
          <p className="rpg-lp-carte-horloge">{volet.horloge}</p>
          <ul className="rpg-lp-carte-points">
            {volet.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    />
  );
}
