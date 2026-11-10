/**
 * Ceux qui jouent déjà, et ce qu'ils en disent.
 *
 * Deux sources, et aucune n'est arrondie pour la vitrine : la fréquentation
 * relevée dans la base, et le sondage `avis-2026-11` posé dans le jeu. On
 * écrit ici les **effectifs**, jamais les pourcentages : ceux-ci se calculent
 * sur le nombre de réponses, et mettre à jour la scène, c'est recopier les
 * nouveaux effectifs du relevé — la page entière suit.
 *
 * Du sondage, la page ne garde que ce qu'ils préfèrent : c'est la seule
 * question qui parle du jeu plutôt que de ses joueurs. Elle admet plusieurs
 * réponses, et ses lignes dépassent donc cent pour cent au total : chacune se
 * lit « tant de joueurs sur cent ont coché cette case ».
 */

export interface Reponse {
  libelle: string;
  effectif: number;
}

/** Ce qui se compte sans sondage. */
export const FREQUENTATION = {
  inscrits: 180,
  actifs7j: 140,
  /** Le jour du relevé, tel qu'on l'écrit dans une phrase. */
  releve: "10 novembre",
};

export const SONDAGE = {
  reponses: 56,
  /** Sur cinq, à deux décimales comme le relevé ; la page l'écrit à une. */
  note: 4.3,

  preferences: [
    { libelle: "Récolte et artisanat", effectif: 50 },
    { libelle: "Campagne et combats", effectif: 31 },
    { libelle: "Le Marché", effectif: 22 },
    { libelle: "Guilde et expéditions", effectif: 19 },
    { libelle: "La Conquête", effectif: 12 },
    { libelle: "La Crypte", effectif: 10 },
    { libelle: "Le classement", effectif: 8 },
    { libelle: "Le chat", effectif: 6 },
    { libelle: "Maison de Maître et Creuset", effectif: 4 },
  ] satisfies Reponse[],
};

/** La part des répondants, en pour cent entier — comme le relevé. */
export function part(effectif: number): number {
  return Math.round((effectif / SONDAGE.reponses) * 100);
}

/** La note telle qu'on l'écrit en français : « 4,3 ». */
export const NOTE = SONDAGE.note.toLocaleString("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const JOUEURS = {
  /* La cité de guilde : des toits, des fumées, du monde. C'est la seule
     peinture du jeu qui montre un lieu habité. */
  fond: "/game/UI/guild/background/cite-apercu.avif",
  surtitre: "11 — Ils y sont déjà",
  titre: "En deux semaines,",
  accent: `${FREQUENTATION.inscrits} héros.`,
  /* Direct, sans tiret : on parle des joueurs comme on en parlerait à
     quelqu'un qui hésite. */
  texte:
    `${FREQUENTATION.inscrits} joueurs nous ont déjà rejoints, et ${FREQUENTATION.actifs7j} ont joué ces sept derniers jours. On leur a demandé leur avis : ${SONDAGE.reponses} nous ont répondu, avec une note moyenne de ${NOTE} sur 5. Et ce qu'ils aiment le plus, c'est récolter et fabriquer.`,
};
