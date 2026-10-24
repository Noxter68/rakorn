"use client";

import type { ReactNode } from "react";
import { useBetaOuverte } from "@/lib/landing/ouverture";

/**
 * Ce qu'on dit avant l'ouverture, et ce qu'on dit après.
 *
 * Pour les phrases qui changent à dix-huit heures — « laissez votre adresse »
 * n'a plus de sens quand les portes sont ouvertes. Avant le montage, la
 * version d'avant, celle que la page construite contient déjà
 * (`useBetaOuverte`).
 */
export function SelonOuverture({ avant, apres }: { avant: ReactNode; apres: ReactNode }) {
  return <>{useBetaOuverte() ? apres : avant}</>;
}
