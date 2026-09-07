"use client";

import Image from "next/image";
import { useEffect } from "react";

/**
 * Une planche, en grand, sur un fond flouté.
 *
 * Les bâtiments d'une cité et les huit expéditions sont des tableaux peints :
 * réduits à une vignette de dix rem, on devine un lieu sans le voir. Le clic
 * les rend à leur taille, et le reste de la page se retire derrière un flou
 * sombre plutôt que de disparaître — on doit sentir qu'on est resté sur la
 * même scène, pas qu'on a changé de page.
 *
 * Trois manières de fermer, parce qu'on en essaie toujours une avant l'autre :
 * la croix, le fond, et Échap. La dernière est celle qu'on tente en premier
 * quand on est pressé, et c'est justement celle qu'on oublie d'écrire.
 *
 * Le défilement de la page est bloqué pendant l'ouverture. Sans cela, la
 * molette fait défiler la scène derrière la planche, et l'on ressort ailleurs
 * que là où l'on était entré.
 */
export function Lightbox({
  ouvert,
  onFermer,
  art,
  titre,
}: {
  ouvert: boolean;
  onFermer: () => void;
  art: string;
  titre: string;
}) {
  useEffect(() => {
    if (!ouvert) return;
    function auClavier(event: KeyboardEvent) {
      if (event.key === "Escape") onFermer();
    }
    const debordement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", auClavier);
    return () => {
      document.body.style.overflow = debordement;
      document.removeEventListener("keydown", auClavier);
    };
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  return (
    <div
      className="rpg-lp-loupe"
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      onClick={onFermer}
    >
      {/* Le clic sur la planche ne referme pas : on la regarde, on ne la
          traverse pas. */}
      <figure className="rpg-lp-loupe-cadre" onClick={(e) => e.stopPropagation()}>
        <Image
          src={art}
          alt={titre}
          width={1672}
          height={941}
          sizes="(min-width: 1400px) 1100px, 88vw"
          className="rpg-lp-loupe-img"
        />
        <figcaption>{titre}</figcaption>
      </figure>
      <button type="button" className="rpg-lp-loupe-fermer" onClick={onFermer} aria-label="Fermer">
        ✕
      </button>
    </div>
  );
}
