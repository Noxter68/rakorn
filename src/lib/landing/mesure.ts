"use client";

/**
 * Les deux moments qu'on veut compter.
 *
 * Une vitrine dont on ne mesure que les visites répond à « combien sont
 * venus » et à rien d'autre. Les deux chiffres qui décident de quoi que ce
 * soit sont ailleurs : combien ont ouvert la fenêtre — l'annonce a porté — et
 * combien l'ont remplie — la page a convaincu. Le rapport des deux est la
 * seule mesure qui dise si c'est le texte ou le formulaire qu'il faut
 * reprendre.
 *
 * Muet si le marqueur n'est pas là : en développement il ne l'est jamais.
 */
type Gtag = (commande: string, evenement: string, parametres?: Record<string, unknown>) => void;

export function mesurer(evenement: string, parametres?: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", evenement, parametres);
}
