"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Onglet } from "@/lib/landing/types";
import { Scene } from "./scene";
import { SceneBackdrop } from "./scene-backdrop";
import { SceneCaption } from "./scene-caption";

/**
 * Une scène à plusieurs états, et le moteur de toute la page.
 *
 * Cinq sections en dépendent — métiers, marché, équipement, combat, campagne,
 * guilde — parce qu'elles font toutes la même chose : une rangée d'onglets
 * change le décor, le texte et ce qui flotte par-dessus. Écrire six fois cette
 * mécanique aurait donné six timings de fondu et six comportements au clavier.
 *
 * **Les surimpressions arrivent déjà rendues**, en tableau de nœuds. Elles
 * contiennent des dizaines d'illustrations : les composer ici obligerait à
 * faire de tout leur contenu du code client, pour un résultat qui ne change
 * jamais après le premier rendu. Le serveur les peint, ce composant ne fait
 * que décider laquelle se voit.
 *
 * Le défilement automatique s'arrête définitivement au premier clic : quelqu'un
 * qui a choisi son onglet n'a pas envie qu'on le lui reprenne six secondes plus
 * tard. Il ne tourne pas non plus hors champ, ni pour qui a demandé moins de
 * mouvement.
 */
export function TabbedScene({
  id,
  className = "",
  onglets,
  overlays = [],
  defilement,
  priority = false,
}: {
  id: string;
  className?: string;
  onglets: Onglet[];
  /**
   * Une surimpression par onglet, rendue côté serveur. Facultatif : la
   * campagne et le combat n'en ont aucune, et une scène qui n'a rien à
   * démontrer ne doit rien poser sur son décor.
   */
  overlays?: ReactNode[];
  /** Millisecondes entre deux onglets, tant que le visiteur n'a rien touché. */
  defilement?: number;
  priority?: boolean;
}) {
  const [actif, setActif] = useState(0);
  const [tenu, setTenu] = useState(false);
  const [enVue, setEnVue] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const guetteur = new IntersectionObserver(([e]) => setEnVue(e.isIntersecting), {
      threshold: 0.35,
    });
    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  useEffect(() => {
    if (!defilement || tenu || !enVue) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteur = setInterval(() => {
      setActif((i) => (i + 1) % onglets.length);
    }, defilement);
    return () => clearInterval(minuteur);
  }, [defilement, tenu, enVue, onglets.length]);

  function choisir(i: number) {
    setTenu(true);
    setActif(i);
  }

  const courant = onglets[actif];

  return (
    <Scene id={id} ref={ref} className={className}>
      <SceneBackdrop
        sources={onglets.map((o) => o.fond)}
        active={actif}
        cadrage={courant.cadrage}
        priority={priority}
      />

      <div className="rpg-lp-inner">
        <div className="rpg-lp-tabs" role="tablist" aria-label={courant.surtitre}>
          {onglets.map((onglet, i) => (
            <button
              key={onglet.cle}
              type="button"
              role="tab"
              aria-selected={i === actif}
              className={`rpg-lp-tab ${i === actif ? "is-on" : ""}`}
              onClick={() => choisir(i)}
            >
              {onglet.onglet}
            </button>
          ))}
        </div>

        {/* Toutes les surimpressions restent montées : c'est ce qui permet au
            fondu d'être un fondu, et non un vide suivi d'une apparition. */}
        {overlays.length > 0 ? (
        <div className="rpg-lp-stage">
          {overlays.map((overlay, i) => (
            <div
              key={onglets[i]?.cle ?? i}
              className={`rpg-lp-stage-layer ${i === actif ? "is-on" : ""}`}
              aria-hidden={i !== actif}
              inert={i !== actif}
            >
              {overlay}
            </div>
          ))}
        </div>
        ) : null}

        {/* La clé rejoue l'entrée du texte à chaque changement : sans elle,
            React réutiliserait les mêmes nœuds et le texte changerait d'un
            coup sec au milieu d'un décor qui, lui, se fond. */}
        <div key={courant.cle} className="rpg-lp-caption-swap">
          <SceneCaption
            surtitre={courant.surtitre}
            titre={courant.titre}
            accent={courant.accent}
            texte={courant.texte}
            reperes={courant.reperes}
            chiffres={courant.chiffres}
          />
        </div>
      </div>
    </Scene>
  );
}
