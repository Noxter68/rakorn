import type { Onglet } from "./types";

/**
 * La conquête du royaume, en cinq vues de la carte.
 *
 * ── Pourquoi elle a pris la place de la carte interactive ─────────────────
 *
 * La section racontait une carte qu'on parcourait à la molette, où les filons
 * changeaient de place à chaque rotation. Le jeu n'a plus cette carte :
 * l'atlas est devenu un registre de terres, et la seule carte qui reste est
 * celle de la conquête — vingt-cinq territoires qu'on tient un temps, seul ou
 * en guilde. Garder l'ancienne section, c'était promettre un écran qu'aucun
 * joueur ne trouverait. Les avis, les chantiers et les coffres, qui y avaient
 * leurs onglets, sont partis avec elle : ce sont des gestes de l'atlas, plus
 * des points sur une carte.
 *
 * ── L'écran est le décor, et il ne bouge pas d'une vue à l'autre ──────────
 *
 * Comme la galerie, la capture sert de fond. Les cinq prises
 * (`pnpm captures conquete`) partagent le même cadrage au pixel : changer
 * d'onglet fait changer la carte **sur place** — les couleurs passent, les
 * bannières se lèvent, le rouge d'un siège monte —, et c'est ce changement
 * qui apprend à la lire. Les états viennent du banc d'essai du jeu : un
 * royaume de développement est au repos, et vingt-cinq territoires libres
 * n'auraient rien montré.
 *
 * ── Peu de mots ───────────────────────────────────────────────────────────
 *
 * Chaque vue répond à une seule question — qu'est-ce que c'est, j'y joue
 * seul, j'y joue en guilde, est-ce que je peux le perdre, qu'est-ce que ça
 * rapporte — en trois phrases au plus. Les chiffres sont ceux de
 * `shared/conquete.ts` : dix places, deux par joueur, huit heures seul, seize
 * en guilde, quatre de répit, des fenêtres de huit.
 */
export const VUES_CONQUETE: Onglet[] = [
  {
    cle: "royaume",
    onglet: "Le royaume",
    fond: "/captures/conquete-royaume.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Vingt-cinq territoires,",
    accent: "un seul royaume.",
    texte:
      "Au-dessus de l'atlas, une carte à prendre. Chaque territoire traverse une situation — famine, hiver, infestation — et réclame ce que vous savez faire : vos pièces, de l'or, des bêtes abattues. Les couleurs disent qui tient quoi ; les régions sombres, celles que la campagne ne vous a pas encore ouvertes.",
    reperes: ["25 TERRITOIRES", "8 SITUATIONS", "UN CLASSEMENT PAR SEMAINE"],
  },
  {
    cle: "solo",
    onglet: "En solo",
    fond: "/captures/conquete-solo.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Seul,",
    accent: "vous tenez votre place.",
    texte:
      "Huit points stratégiques, dix places chacun. Apportez vous-même ce que le lieu réclame, prenez votre place, et gardez son bonus huit heures. Deux à la fois, sans guilde : un joueur seul compte sur la carte.",
    reperes: ["8 POINTS STRATÉGIQUES", "10 PLACES", "8 H DE CONTRÔLE"],
  },
  {
    cle: "guilde",
    onglet: "En guilde",
    fond: "/captures/conquete-guilde.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "En guilde,",
    accent: "on prend des régions.",
    texte:
      "La capitale, les sièges et les bastions se prennent à plusieurs : une jauge commune, où chacun verse la pièce de son métier. La maison en tête d'influence l'emporte à la dernière unité ; chacun touche sa part, pesée à ce qu'il a porté, et la maison battue repart avec le quart.",
    reperes: ["17 TERRITOIRES", "16 H DE CONTRÔLE", "PART AU MÉRITE"],
  },
  {
    cle: "siege",
    onglet: "Le siège",
    fond: "/captures/conquete-siege.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Ce qu'on tient,",
    accent: "d'autres le convoitent.",
    texte:
      "Une maison rivale peut remplir une jauge de siège sur votre terre : pleine, le territoire change de main sur-le-champ. Le répit, la fortification et l'horloge vous défendent — la jauge retombe à chaque nouvelle fenêtre, et tenir bon ne demande pas d'être devant l'écran.",
    reperes: ["4 H DE RÉPIT", "3 CRANS DE FORTIFICATION", "FENÊTRES DE 8 H"],
  },
  {
    cle: "bonus",
    onglet: "Les bonus",
    fond: "/captures/conquete-bonus.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Ce que la terre",
    accent: "vous rapporte.",
    texte:
      "Chaque territoire a sa signature : plus de récolte, une taxe de marché plus douce, de l'expérience à l'établi, de l'or et de l'attaque en campagne. Tant que vous le tenez, chaque écran qu'il touche montre la valeur d'avant et celle d'après. Les bonus de maison vont aux caravanes, à la cité et aux expéditions.",
    reperes: ["20 EFFETS", "25 SIGNATURES", "AVANT → APRÈS"],
  },
];
