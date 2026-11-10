"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CAPTURES_OUVERTURE } from "@/lib/landing/page";

const DUREE = 5000;

export function HeroShowcase() {
  const [actif, setActif] = useState(0);
  const [enVue, setEnVue] = useState(false);
  const [tenu, setTenu] = useState(false);
  const cadre = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = cadre.current;
    if (!element) return;
    const observateur = new IntersectionObserver(([entree]) => setEnVue(entree.isIntersecting), {
      threshold: 0.25,
    });
    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  useEffect(() => {
    if (!enVue || tenu || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteur = window.setInterval(() => {
      if (document.visibilityState === "visible") setActif((n) => (n + 1) % CAPTURES_OUVERTURE.length);
    }, DUREE);
    return () => window.clearInterval(minuteur);
  }, [enVue, tenu]);

  return (
    <figure ref={cadre} className="rpg-lp-hero-vitrine">
      <span className="rpg-lp-hero-ecran" aria-label="Aperçu du jeu Rakorn">
        {CAPTURES_OUVERTURE.map((capture, i) => (
          <span
            key={capture.label}
            className={`rpg-lp-hero-slide ${i === actif ? "is-on" : ""} ${capture.label === "Combat" ? "is-combat" : ""}`}
            aria-hidden={i !== actif}
          >
            <picture>
              <source media="(max-width: 720px)" srcSet={capture.mobile} />
              <Image src={capture.image} alt={i === actif ? capture.alt : ""} fill
                sizes="(max-width: 720px) 260px, min(100vw, 1600px)"
                priority={i === 0} loading={i === 0 ? undefined : "eager"}
                unoptimized draggable={false} />
            </picture>
            {capture.label === "Combat" && <span className="rpg-lp-hero-combat-label">Combat en paysage</span>}
          </span>
        ))}
      </span>
      <figcaption className="rpg-lp-hero-controls" aria-label="Captures du jeu">
        {CAPTURES_OUVERTURE.map((capture, i) => (
          <button key={capture.label} type="button" aria-label={`Voir ${capture.label}`}
            aria-pressed={i === actif} className={`rpg-lp-hero-control ${i === actif ? "is-on" : ""}`}
            onClick={() => { setActif(i); setTenu(true); }}>
            <span className="rpg-lp-diamond" aria-hidden>
              <Image src={capture.icone} alt="" fill sizes="26px" />
            </span>
            <span>{capture.label}</span>
          </button>
        ))}
      </figcaption>
    </figure>
  );
}
