"use client";

import { useEffect } from "react";

/**
 * Le seul écouteur de défilement de la page.
 *
 * Trois choses dépendent de la position : la jauge de progression, l'état de
 * la barre du haut, et la parallaxe des décors. Les câbler séparément
 * donnerait trois écouteurs qui liraient chacun la géométrie du document au
 * même instant — c'est ainsi qu'on obtient une page qui saccade sans qu'aucun
 * calcul pris isolément ne soit coûteux.
 *
 * Ici, un seul écouteur, passif, qui ne fait que réclamer une image. Tout le
 * travail se fait dans une unique passe de `requestAnimationFrame` : on lit,
 * puis on écrit, jamais l'inverse.
 *
 * **La progression s'écrit sur la scène, jamais sur le décor.** Le décor porte
 * une transformation issue de `--p` ; mesurer un élément déjà transformé
 * rendrait une position qui dépend de sa propre translation, et la parallaxe
 * se mettrait à osciller autour de sa valeur. La scène, elle, ne bouge pas.
 *
 * Les scènes hors champ ne sont pas mesurées : un observateur tient la liste
 * de celles qui comptent, et il y en a au plus deux à la fois.
 */
export function ScrollDirector() {
  useEffect(() => {
    const racine = document.documentElement;
    const jauge = document.getElementById("rpg-lp-progress");
    const scenes = new Set<HTMLElement>();

    const guetteur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          const scene = entree.target as HTMLElement;
          if (entree.isIntersecting) scenes.add(scene);
          else {
            scenes.delete(scene);
            scene.style.removeProperty("--p");
          }
        }
        planifier();
      },
      // Une marge d'un tiers d'écran : la scène est déjà réglée quand elle
      // paraît, au lieu de sauter à sa position au moment où on l'aperçoit.
      { rootMargin: "34% 0px" },
    );

    for (const scene of racine.querySelectorAll<HTMLElement>("[data-parallax]")) {
      guetteur.observe(scene);
    }

    let image = 0;

    function peindre() {
      image = 0;
      const course = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;

      if (jauge) jauge.style.transform = `scaleX(${course > 0 ? y / course : 0})`;
      // Un attribut sur la racine plutôt qu'un état React : la barre du haut
      // se repeint en CSS, sans qu'un rendu traverse l'arbre à chaque pixel.
      if (y > 60) racine.setAttribute("data-scrolled", "");
      else racine.removeAttribute("data-scrolled");

      for (const scene of scenes) {
        const cadre = scene.getBoundingClientRect();
        // −1 quand la scène arrive par le bas, 0 quand elle est centrée,
        // +1 quand elle sort par le haut.
        const p = (cadre.top + cadre.height / 2 - window.innerHeight / 2) / window.innerHeight;
        scene.style.setProperty("--p", p.toFixed(4));
      }
    }

    function planifier() {
      if (!image) image = requestAnimationFrame(peindre);
    }

    peindre();
    window.addEventListener("scroll", planifier, { passive: true });
    window.addEventListener("resize", planifier, { passive: true });

    return () => {
      window.removeEventListener("scroll", planifier);
      window.removeEventListener("resize", planifier);
      guetteur.disconnect();
      if (image) cancelAnimationFrame(image);
    };
  }, []);

  return null;
}
