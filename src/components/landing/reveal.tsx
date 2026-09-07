"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Un bloc qui se pose quand il entre dans le champ.
 *
 * Une opacité et vingt-six pixels de translation, pas davantage : sur une page
 * qu'on parcourt d'une traite, une animation qui se remarque devient une
 * animation qu'on subit dix fois.
 *
 * L'observation se coupe au premier passage. Rejouer l'entrée à chaque remontée
 * transforme la page en manège.
 *
 * Rien ne se joue pour qui a demandé moins de mouvement, et c'est le CSS qui
 * s'en charge : sous cette préférence, le bloc naît à sa place définitive.
 */
export function Reveal({
  children,
  delay = 0,
  as: Balise = "div",
  className = "",
}: {
  children: ReactNode;
  /** Décalage en millisecondes, pour échelonner les éléments d'une rangée. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const guetteur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        setVu(true);
        guetteur.disconnect();
      },
      { threshold: 0.12 },
    );
    guetteur.observe(el);
    return () => guetteur.disconnect();
  }, []);

  return (
    <Balise
      /* Un seul `ref` pour cinq balises possibles : React type le sien par
         élément, et l'union qu'il en déduit n'accepte plus rien. La fonction de
         rappel contourne la déduction sans mentir sur le type stocké. */
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={`rpg-lp-reveal ${vu ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Balise>
  );
}
