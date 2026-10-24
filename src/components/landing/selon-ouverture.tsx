"use client";

import type { ReactNode } from "react";
import { useBetaOuverte } from "@/lib/landing/ouverture";

/**
 * Ce qu'on dit avant l'ouverture, et ce qu'on dit après.
 *
 * Pour les phrases qui changent à l'ouverture — « laissez votre adresse »
 * n'a plus de sens quand les portes sont ouvertes (`BETA_OUVERTE`).
 */
export function SelonOuverture({ avant, apres }: { avant: ReactNode; apres: ReactNode }) {
  return <>{useBetaOuverte() ? apres : avant}</>;
}
