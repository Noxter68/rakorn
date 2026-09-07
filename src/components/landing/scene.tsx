import type { ReactNode, Ref } from "react";

/**
 * La coquille d'une scène.
 *
 * Toute la page tient dans cette forme : une hauteur d'écran, rien qui
 * déborde, et une gouttière intérieure commune. Le `data-parallax` est le
 * point d'accroche du `ScrollDirector`, qui y écrit la progression sous forme
 * de `--p` — c'est cette variable, et elle seule, qui anime le décor.
 */
export function Scene({
  id,
  className = "",
  children,
  ref,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}) {
  return (
    <section id={id} ref={ref} data-parallax className={`rpg-lp-scene ${className}`}>
      {children}
    </section>
  );
}

/** La colonne utile, à l'intérieur d'une scène. */
export function SceneInner({ children }: { children: ReactNode }) {
  return <div className="rpg-lp-inner">{children}</div>;
}
