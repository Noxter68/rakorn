"use client";

import { useEffect } from "react";

/**
 * Les illustrations ne se décollent plus du décor.
 *
 * Attraper une image la détachait de la page et la traînait en semi-
 * transparence sous le curseur — le geste natif du navigateur, hérité des
 * pages de documents. Sur une vitrine dont tout l'argument est l'immersion,
 * c'est la première chose qui rappelle qu'on lit un document.
 *
 * Un seul écouteur plutôt que `draggable={false}` sur chaque balise, et plutôt
 * que `-webkit-user-drag` en CSS, que Firefox ignore. La version du jeu épargne
 * ce qui part d'un conteneur explicitement glissable — le sac, le sertissage ;
 * ici rien ne se glisse, la condition n'aurait rien à protéger.
 */
export function ImageDragGuard() {
  useEffect(() => {
    function refuserLeFantome(event: DragEvent) {
      event.preventDefault();
    }

    document.addEventListener("dragstart", refuserLeFantome);
    return () => document.removeEventListener("dragstart", refuserLeFantome);
  }, []);

  return null;
}
