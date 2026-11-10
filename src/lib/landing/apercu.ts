import type { Onglet } from "./types";

/**
 * La galerie : dix écrans du jeu, tels qu'on les trouve en jouant.
 *
 * Le reste de la page raconte des systèmes — la boucle des métiers, les rangs
 * de gemmes, les paliers d'ensemble — avec les illustrations du jeu mais
 * presque jamais ses écrans. On pouvait lire les huit sections et n'avoir
 * aucune idée de ce à quoi le jeu ressemble une fois ouvert. Celle-ci ne
 * raconte rien : elle montre.
 *
 * Ce sont des captures prises par `pnpm captures`, sur une partie réelle. Elles
 * portent donc les chiffres d'un personnage déjà avancé. Un écran vide ne
 * montre pas un jeu, il montre un formulaire.
 */
export type Ecran = Onglet;

/** Le décor est la capture elle-même — voir `.is-captures`. */
export const ECRANS: Ecran[] = [
  {
    cle: "metiers",
    onglet: "Métiers",
    fond: "/captures/jeu-metiers.avif",
    fondMobile: "/captures/jeu-metiers-mobile.avif",
    surtitre: "10 — Aperçu · La salle des métiers",
    titre: "Voilà à quoi",
    accent: "ça ressemble.",
    texte:
      "Vos métiers en haut, la récolte ou l'établi au centre, et la fiche de ce qu'on prépare à droite : durée, énergie, expérience, ce que la pièce apporte — et dessous, ce qu'il faut avoir en main pour la lancer.",
    reperes: ["8 MÉTIERS", "RÉCOLTE ET ARTISANAT", "NIVEAU 60"],
  },
  {
    cle: "codex",
    onglet: "Codex",
    fond: "/captures/jeu-codex.avif",
    fondMobile: "/captures/jeu-codex-mobile.avif",
    surtitre: "10 — Aperçu · Le codex",
    titre: "Tout est écrit",
    accent: "quelque part.",
    texte:
      "Des centaines de fiches, et chacune répond aux mêmes questions : d'où vient cette pièce, ce qu'elle vaut, et ce qu'il faut pour la faire. Ses matériaux sont posés dessous, chacun avec sa provenance.",
    reperes: ["FICHES ET RECETTES", "BESTIAIRE", "ENSEMBLES"],
  },
  {
    cle: "contrats",
    onglet: "Contrats",
    fond: "/captures/jeu-contrats.avif",
    fondMobile: "/captures/jeu-contrats-mobile.avif",
    surtitre: "10 — Aperçu · Les contrats",
    titre: "Ce que la Couronne",
    accent: "attend de vous.",
    texte:
      "Cinq livraisons par jour, tirées à votre niveau, et les contrats de la semaine : ce qu'il faut livrer, ce que ça rapporte en or et en réputation d'artisan, et ce qu'on a déjà dans le sac pour le remplir.",
    reperes: ["5 PAR JOUR", "JOURNALIERS ET HEBDOMADAIRES", "RÉPUTATION D'ARTISAN"],
  },
  {
    cle: "competences",
    onglet: "Compétences",
    fond: "/captures/jeu-competences.avif",
    fondMobile: "/captures/jeu-competences-mobile.avif",
    surtitre: "10 — Aperçu · Les compétences",
    titre: "Préparez votre ordre",
    accent: "de bataille.",
    texte:
      "Choisissez les techniques que votre héros emporte au combat, organisez leur ordre et adaptez votre stratégie avant la prochaine rencontre.",
    reperes: ["TECHNIQUES", "ORDRE DE BATAILLE", "STRATÉGIE"],
  },
  {
    cle: "personnage",
    onglet: "Personnage",
    fond: "/captures/jeu-personnage.avif",
    fondMobile: "/captures/jeu-personnage-mobile.avif",
    surtitre: "10 — Aperçu · La fiche de personnage",
    titre: "Douze pièces,",
    accent: "et ce qu'elles font.",
    texte:
      "La silhouette au centre, les emplacements autour, et la pièce désignée détaillée à droite : ses statistiques, ses châsses, son usure, et le palier d'ensemble qu'elle ouvre.",
    reperes: ["12 EMPLACEMENTS", "SERTISSAGE", "PANOPLIES"],
  },
  {
    cle: "inventaire",
    onglet: "Inventaire",
    fond: "/captures/jeu-inventaire.avif",
    fondMobile: "/captures/jeu-inventaire-mobile.avif",
    surtitre: "10 — Aperçu · L'inventaire",
    titre: "Quinze places",
    accent: "au départ.",
    texte:
      "Le sac en cases, par rayons — un par métier, plus les armes, les armures et le reste —, et la fiche de ce qu'on tient à côté. Les places suivantes se fabriquent : c'est l'ingénieur et le couturier qui décident de ce qu'on peut rapporter.",
    reperes: ["RAYONS PAR MÉTIER", "SACS À FABRIQUER", "RECYCLAGE"],
  },
  {
    cle: "campagne",
    onglet: "Campagne",
    fond: "/captures/jeu-campagne.avif",
    fondMobile: "/captures/jeu-campagne-mobile.avif",
    surtitre: "10 — Aperçu · La campagne",
    titre: "Huit chapitres",
    accent: "sur une carte.",
    texte:
      "La bande du bas déroule les huit terres, et la créature suivante est annoncée à droite avec ses trois chiffres et ce qu'elle rapporte. Quinze combats par terre, et la suivante s'ouvre.",
    reperes: ["8 TERRES", "120 CRÉATURES", "15 COMBATS PAR TERRE"],
  },
  {
    cle: "forge",
    onglet: "Forge",
    fond: "/captures/jeu-forge.avif",
    fondMobile: "/captures/jeu-forge-mobile.avif",
    surtitre: "10 — Aperçu · La forge",
    titre: "Réparer, sertir,",
    accent: "démonter.",
    texte:
      "L'établi : on y répare ce qui s'use, on y sertit les gemmes taillées, on y monte les crans d'outil, et l'on y recycle en matière ce qui ne sert plus.",
    reperes: ["RÉPARATION", "SERTISSAGE", "RECYCLAGE"],
  },
  {
    cle: "quetes",
    onglet: "Quêtes",
    fond: "/captures/jeu-quetes.avif",
    fondMobile: "/captures/jeu-quetes-mobile.avif",
    surtitre: "10 — Aperçu · Les quêtes",
    titre: "Une aventure",
    accent: "à poursuivre.",
    texte:
      "Le journal réunit les objectifs à accomplir et suit votre progression à travers le royaume, des premiers pas aux défis plus ambitieux.",
    reperes: ["JOURNAL", "OBJECTIFS", "PROGRESSION"],
  },
  {
    cle: "guilde",
    onglet: "Guilde",
    fond: "/captures/jeu-guilde.avif",
    fondMobile: "/captures/jeu-guilde-mobile.avif",
    surtitre: "10 — Aperçu · La guilde",
    titre: "Bâtissez",
    accent: "avec les autres.",
    texte:
      "Retrouvez les activités communes, les projets de la maison et la place de chacun dans la progression de votre guilde.",
    reperes: ["PROJETS COMMUNS", "COOPÉRATION", "ROYAUME"],
  },
];
