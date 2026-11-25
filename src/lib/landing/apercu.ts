import type { Onglet } from "./types";

/**
 * La galerie : douze écrans du jeu, tels qu'on les trouve en jouant.
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
      "Vos métiers à gauche, le Maître-queux en annexe, les recettes au centre, et la fiche de la pièce à droite : sa maîtrise, de l'honnête au chef-d'œuvre, ce qu'il faut réunir pour la lancer, et ce que le lot rapporte.",
    reperes: ["8 MÉTIERS ET 1 ANNEXE", "RÉCOLTE ET ARTISANAT", "NIVEAU 60"],
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
      "Cinq lettres par jour, tirées à votre niveau, et le décret de la semaine : ce qu'il faut livrer, ce que ça rapporte en or et en réputation d'artisan, et ce qu'on a déjà dans le sac pour le remplir.",
    reperes: ["5 LETTRES PAR JOUR", "UN DÉCRET PAR SEMAINE", "RÉPUTATION D'ARTISAN"],
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
      "Le portrait au centre, les douze pièces autour avec leur nom à la couleur de leur rareté, et vos chiffres au pied : puissance, attaque, armure, parade, critique et vie. Survolez une pièce, et elle dit ce qu'elle apporte.",
    reperes: ["12 EMPLACEMENTS", "PUISSANCE", "PANOPLIES"],
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
      "Le héros au centre, ses statistiques et ses métiers à gauche, le sac en cases à droite. Les places suivantes se fabriquent : couturier, logisticien, ingénieur et mineur décident de ce qu'on peut rapporter.",
    reperes: ["15 PLACES", "SACS À FABRIQUER", "TRI DU SAC"],
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
      "La bande du bas déroule les huit terres, l'objectif du moment est posé à droite et le suivi des quêtes à gauche. Quinze combats par terre, dont trois boss, et la suivante s'ouvre.",
    reperes: ["8 TERRES", "120 CRÉATURES", "24 BOSS"],
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
    cle: "maison",
    onglet: "Maison de Maître",
    fond: "/captures/jeu-maison.avif",
    fondMobile: "/captures/jeu-maison-mobile.avif",
    surtitre: "10 — Aperçu · La Maison de Maître",
    titre: "Au sommet,",
    accent: "une maison à vous.",
    texte:
      "Au niveau 60, l'artisan fonde sa Maison : l'Atelier principal, les Archives où l'on cherche les traitements de Maître, la Forge magistrale où on les pose, et le comptoir où arrivent les pièces que les autres vous confient.",
    reperes: ["NIVEAU 60", "TROIS SALLES À BÂTIR", "TRAITEMENTS DE MAÎTRE"],
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
    cle: "hauts-faits",
    onglet: "Hauts faits",
    fond: "/captures/jeu-hauts-faits.avif",
    fondMobile: "/captures/jeu-hauts-faits-mobile.avif",
    surtitre: "10 — Aperçu · Les hauts faits",
    titre: "Tout ce que vous faites",
    accent: "laisse une trace.",
    texte:
      "Mille trois cent soixante-douze hauts faits, rangés en dix familles — campagne, récolte, artisanat, marché, guilde, donjons… —, chacune avec sa jauge. Les derniers obtenus en tête, et les titres qu'ils vous laissent porter sous votre nom.",
    reperes: ["1 372 HAUTS FAITS", "10 FAMILLES", "DES TITRES À PORTER"],
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
      "L'aperçu de la maison : ses bonus actifs, ses membres, sa place au classement, ses fonds, et les convocations qui disent l'ordre du jour.",
    reperes: ["BONUS DE MAISON", "TRÉSORERIE", "CONVOCATIONS"],
  },
];
