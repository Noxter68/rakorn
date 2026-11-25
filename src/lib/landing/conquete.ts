import type { Onglet } from "./types";

/**
 * La conquête du royaume, en cinq vues de la carte.
 *
 * ── Ce qu'elle est depuis Rakorn 2.0 ──────────────────────────────────────
 *
 * La conquête est la fenêtre « Conquête » du jeu, sur la carte du monde :
 * cent onze territoires en huit zones (3, 3, 3, 5, 7, 30, 20, 40), et Rakorn
 * au milieu (`territoires-de-la-carte.json`). Ils se prennent **en guilde**
 * et par **objectifs** — vaincre des créatures de la zone, récolter à ses
 * gisements aux Métiers, parfois abattre son seigneur —, et se tiennent
 * jusqu'à ce qu'une autre maison les reprenne (`shared/conquete.ts`). Plus
 * de situations, d'apports d'objets, de places personnelles, de durée de
 * contrôle ni de fenêtres de siège : la version précédente de cette scène
 * les décrivait toutes, et un visiteur les aurait cherchées en vain.
 *
 * ── L'écran est le décor, et il ne bouge pas d'une vue à l'autre ──────────
 *
 * Les cinq prises de bureau (`pnpm captures conquete`) partagent le même
 * cadrage au pixel : changer d'onglet fait changer la carte **sur place**.
 * Les états viennent du banc d'essai du jeu ; au téléphone, la liste montre
 * l'état réel de la partie locale. Les clefs des onglets sont celles des
 * fichiers de capture, d'où « solo » pour la vue qui montre la prise.
 *
 * ── Peu de mots ───────────────────────────────────────────────────────────
 *
 * Chaque vue répond à une seule question — qu'est-ce que c'est, comment on
 * prend, combien de temps on garde, est-ce qu'on peut le perdre, qu'est-ce
 * que ça rapporte — en trois phrases au plus. Les chiffres sont ceux de
 * `shared/conquete.ts` : vingt effets, du simple au double de la zone 1 à la
 * 8, une attaque à une fois et demie, la dîme d'un dixième.
 */
export const VUES_CONQUETE: Onglet[] = [
  {
    cle: "royaume",
    onglet: "Le royaume",
    fond: "/captures/conquete-royaume.avif",
    fondMobile: "/captures/conquete-royaume-mobile.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Cent onze territoires,",
    accent: "un seul royaume.",
    texte:
      "La conquête se joue sur la carte du monde : huit zones découpées en territoires, et Rakorn au milieu. Les couleurs disent qui tient quoi — bleu pour votre maison, rouge pour ce qui se dispute, or pour ce que vous êtes en train de prendre ; les zones que la campagne ne vous a pas encore ouvertes restent dans le brouillard.",
    reperes: ["111 TERRITOIRES", "8 ZONES", "UN CLASSEMENT PAR SEMAINE"],
  },
  {
    cle: "solo",
    onglet: "Prendre",
    fond: "/captures/conquete-solo.avif",
    fondMobile: "/captures/conquete-solo-mobile.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Une terre se prend,",
    accent: "elle ne s'achète pas.",
    texte:
      "Engagez-vous sur un territoire, et chaque victoire en campagne dans sa zone, chaque récolte à ses gisements fait avancer votre maison. Certains demandent aussi la tête de leur seigneur. La première maison qui achève tout l'emporte.",
    reperes: ["EN GUILDE", "CAMPAGNE ET RÉCOLTE", "UN TERRITOIRE À LA FOIS"],
  },
  {
    cle: "guilde",
    onglet: "Tenir",
    fond: "/captures/conquete-guilde.avif",
    fondMobile: "/captures/conquete-guilde-mobile.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Ce qu'on tient,",
    accent: "on le garde.",
    texte:
      "Pas d'horloge, pas de bail : une maison tient son territoire tant qu'une autre ne le lui reprend pas. Chaque terre verse son tribut au trésor tous les jours, et prélève la dîme — un dixième de ce que les autres y récoltent et y gagnent.",
    reperes: ["SANS LIMITE DE DURÉE", "TRIBUT QUOTIDIEN", "DÎME DE 10 %"],
  },
  {
    cle: "siege",
    onglet: "Le conflit",
    fond: "/captures/conquete-siege.avif",
    fondMobile: "/captures/conquete-siege-mobile.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Ce que vous tenez,",
    accent: "d'autres le convoitent.",
    texte:
      "Une maison rivale peut s'engager sur votre terre : ses objectifs y comptent une fois et demie, et quand elle les achève, le territoire change de main sur-le-champ. On ne monte pas la garde — on reprend.",
    reperes: ["OBJECTIFS × 1,5", "CHANGE DE MAIN SUR-LE-CHAMP", "EN CONFLIT SUR LA CARTE"],
  },
  {
    cle: "bonus",
    onglet: "Les bonus",
    fond: "/captures/conquete-bonus.avif",
    fondMobile: "/captures/conquete-bonus-mobile.avif",
    surtitre: "07 — La conquête du royaume",
    titre: "Ce que la terre",
    accent: "vous rapporte.",
    texte:
      "Chaque territoire porte un effet : plus de récolte, une taxe de marché plus douce, de l'expérience à l'établi, de l'or et de l'attaque en campagne, des caravanes et des expéditions plus fructueuses. Il profite à toute la maison, et vaut deux fois plus au fond du royaume qu'à ses portes. Tenez Rakorn, et chaque membre reçoit 3 000 or par semaine.",
    reperes: ["20 EFFETS", "TOUTE LA MAISON", "3 000 OR PAR SEMAINE"],
  },
];
