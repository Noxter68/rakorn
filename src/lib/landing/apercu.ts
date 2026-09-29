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
 * portent donc les chiffres d'un personnage de niveau soixante — un sac plein,
 * des métiers hauts, une Maison achevée. C'est délibéré : un écran vide ne
 * montre pas un jeu, il montre un formulaire.
 */
export type Ecran = Onglet;

/** Le décor est la capture elle-même — voir `.is-captures`. */
export const ECRANS: Ecran[] = [
  {
    cle: "metiers",
    onglet: "Métiers",
    fond: "/captures/jeu-metiers.avif",
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
    surtitre: "10 — Aperçu · Le codex",
    titre: "Tout est écrit",
    accent: "quelque part.",
    texte:
      "Des centaines de fiches, et chacune répond aux mêmes questions : d'où vient cette pièce, ce qu'elle vaut, et ce qu'il faut pour la faire. Ses matériaux sont posés dessous, chacun avec sa provenance.",
    reperes: ["461 FICHES", "BESTIAIRE", "ENSEMBLES"],
  },
  {
    cle: "contrats",
    onglet: "Contrats",
    fond: "/captures/jeu-contrats.avif",
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
    surtitre: "10 — Aperçu · Les compétences",
    titre: "Trois arbres,",
    accent: "et des choix à faire.",
    texte:
      "Récolte, combat, artisanat : chaque arbre a sa source de points — votre métier, votre niveau, ce que vous avez fabriqué. Sept lignes qui s'ouvrent l'une après l'autre, des talents qui s'excluent, et une clé de voûte au sommet.",
    reperes: ["3 ARBRES", "20 POINTS PAR ARBRE", "3 CLÉS DE VOÛTE"],
  },
  {
    cle: "personnage",
    onglet: "Personnage",
    fond: "/captures/jeu-personnage.avif",
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
    surtitre: "10 — Aperçu · La forge",
    titre: "Réparer, sertir,",
    accent: "démonter.",
    texte:
      "L'établi : on y répare ce qui s'use, on y sertit les gemmes taillées, on y monte les crans d'outil, et l'on y recycle en matière ce qui ne sert plus.",
    reperes: ["RÉPARATION", "SERTISSAGE", "RECYCLAGE"],
  },
  {
    cle: "maison",
    onglet: "Maison de Maître",
    fond: "/captures/jeu-maison.avif",
    surtitre: "10 — Aperçu · La Maison de Maître",
    titre: "Quatre salles,",
    accent: "et de quoi les remplir.",
    texte:
      "L'atelier principal, les Archives, la Forge magistrale et le Comptoir des Maîtres. Elles se bâtissent une à une, en Renom et en matières, et chacune ouvre ce que les autres ne savent pas faire.",
    reperes: ["4 SALLES", "RENOM", "POINÇON DE MAÎTRE"],
  },
  {
    cle: "archives",
    onglet: "Archives",
    fond: "/captures/jeu-archives.avif",
    surtitre: "10 — Aperçu · Les Archives",
    titre: "Ce qui se cherche",
    accent: "avant de se poser.",
    texte:
      "La constellation des recherches : un traitement s'étudie avant de pouvoir être appliqué, et son rang se monte ensuite. C'est d'ici que sortent la trempe volcanique et la gravure draconique.",
    reperes: ["RECHERCHES PAR MÉTIER", "RANGS À MONTER", "TABLES D'ÉTUDE"],
  },
];
