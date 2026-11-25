import type { Onglet, Repere } from "./types";

/**
 * Les quatre familles de techniques, et quatre coups pour chacune.
 *
 * Les familles sont celles du jeu : l'Ordre de bataille range ses techniques
 * en Dégâts, Défense, Contrôle et Soins (`CATEGORIE_LABEL`, d'après la
 * `category` de chaque technique dans `abilities.ts`), et c'est par elles
 * qu'on filtre la barre. La scène en reprenait autrefois quatre « approches »
 * — agressive, défensive, patiente, à distance — que le jeu n'a jamais
 * proposées au joueur : un visiteur les aurait cherchées en vain.
 *
 * **Les quatre coups s'y lisent en rotation et non en grille.** Deux colonnes
 * de deux disaient « en voici quatre » ; un cercle où l'on passe de l'un à
 * l'autre dit comment on joue — une action par tour, et des recharges qui
 * décident de l'ordre. C'est la même donnée, lue dans le sens du jeu.
 */

/**
 * Un coup, et les deux nombres qui décident de sa place dans une rotation.
 *
 * `recharge` et `niveau` sont relevés dans `packages/shared/src/combat/
 * abilities.ts`, où ils sont écrits une fois pour le jeu. Ce sont eux qui font
 * de la rotation autre chose qu'un joli cercle : quatre coups dont les
 * recharges vont de trois à six tours **ne peuvent pas** se jouer l'un après
 * l'autre indéfiniment, et c'est exactement ce que la scène doit faire
 * comprendre.
 *
 * Le texte est court, et il l'est par nécessité de place : autour d'un cercle,
 * chaque légende dispose de treize rem. Les phrases longues qui vivaient ici
 * disaient, moins bien, ce que le paragraphe du bas de scène dit déjà.
 */
export interface Coup {
  art: string;
  nom: string;
  /** L'effet, en trois ou quatre mots. */
  effet: string;
  /** Les tours de recharge, relevés dans `abilities.ts`. */
  recharge: number;
  /** Le niveau qui l'ouvre, relevé au même endroit. */
  niveau: number;
}

export interface Tactique extends Onglet {
  /**
   * Une planche de bataille, en bandeau du panneau de rotation, fondue par
   * les bords. Ce sont des illustrations du jeu sans texte : elles donnent le
   * ton de la famille, elles ne nomment rien.
   */
  carte: string;
  /** Ce que la chaîne enchaîne, au centre du cercle. */
  chaine: string;
  coups: Coup[];
}

const FOND = "/game/UI/combat/background/background-battle.avif";
const SURTITRE = "05 — Combat tactique";

/**
 * Ce que le combat pèse, en chiffres.
 *
 * Relevés dans le contenu : trente-six techniques dans `abilities.ts` —
 * vingt-trois qui s'ouvrent avec le niveau, cinq Arts que les quêtes
 * enseignent et huit que l'arbre de talents du combat accorde —, cinq places
 * de barre (`MAX_ABILITY_SLOTS`), cent vingt créatures de campagne dont
 * vingt-quatre boss, trois par terre (`isBoss` en base).
 *
 * Quatre et non cinq : à cinq, la rangée dépassait la colonne du texte sur un
 * portable et passait à la ligne.
 */
export const CHIFFRES_COMBAT: Repere[] = [
  {
    art: "/game/UI/navigation-v4/talent.avif",
    valeur: "36",
    quoi: "techniques",
  },
  { art: "/game/UI/pages/inventaire/sections/equipement-v2.avif", valeur: "5", quoi: "emportées" },
  { art: "/game/UI/navigation-v4/codex.avif", valeur: "120", quoi: "créatures" },
  { art: "/game/UI/navigation-v4/haut-faits.avif", valeur: "24", quoi: "boss" },
];

/**
 * Comment on joue, en une phrase. Les rangs se paient en Trempe, gagnée à la
 * première victoire sur chaque créature (`ranks.ts`, `campaign.service.ts`).
 */
export const REGLE_COMBAT =
  "Un combat se joue au tour par tour : cinq techniques emportées sur trente-six, une action par tour, et des effets qui continuent d'agir quand on ne fait plus rien. Chaque technique monte jusqu'au rang V, payé en Trempe.";

export const TACTIQUES: Tactique[] = [
  {
    cle: "degats",
    chaine: "Chaîne de dégâts",
    onglet: "Dégâts",
    carte: "/game/UI/campagne/tactic/cards/agressive.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Frappez d'abord.",
    accent: "Terminez avant lui.",
    texte:
      "Coup lourd, brise-garde, exécution : la famille des dégâts écourte les combats et transforme un adversaire blessé en adversaire mort. Encore faut-il le blesser le premier — et tenir jusqu'à ce que les recharges reviennent.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      { art: "/game/UI/combat/character-abilities/coup-lourd.avif", nom: "Coup lourd", effet: "tout le poids du corps", recharge: 3, niveau: 3 },
      { art: "/game/UI/combat/character-abilities/brise-garde.avif", nom: "Brise-garde", effet: "armure trouée · 3 tours", recharge: 4, niveau: 8 },
      { art: "/game/UI/combat/character-abilities/execution.avif", nom: "Exécution", effet: "coup double sous 30 % de vie", recharge: 6, niveau: 55 },
      { art: "/game/UI/combat/character-abilities/fureur.avif", nom: "Fureur", effet: "deux frappes et demie · saignement", recharge: 6, niveau: 60 },
    ],
  },
  {
    cle: "defense",
    chaine: "Mur et riposte",
    onglet: "Défense",
    carte: "/game/UI/campagne/tactic/cards/defensive.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Encaissez,",
    accent: "puis rendez le double.",
    texte:
      "Laissez venir, absorbez, et rendez au moment où il se découvre. Garde, rempart, riposte : contre ce qui frappe fort et rarement, la défense vous offre une seconde chance — et contre l'ultime qu'un boss annonce deux tours à l'avance, elle est souvent la seule.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      { art: "/game/UI/combat/character-abilities/garde.avif", nom: "Garde", effet: "un quart des coups en moins", recharge: 3, niveau: 1 },
      { art: "/game/UI/combat/character-abilities/rempart.avif", nom: "Rempart", effet: "trois tours retranché", recharge: 5, niveau: 24 },
      { art: "/game/UI/combat/character-abilities/riposte.avif", nom: "Riposte", effet: "rend la moitié encaissée", recharge: 4, niveau: 34 },
      { art: "/game/UI/combat/character-abilities/grande-parade.avif", nom: "Grande parade", effet: "six coups sur dix évités", recharge: 6, niveau: 42 },
    ],
  },
  {
    cle: "controle",
    chaine: "Tours volés",
    onglet: "Contrôle",
    carte: "/game/UI/campagne/tactic/cards/a-distance.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Volez-lui",
    accent: "les tours qui comptent.",
    texte:
      "Empoisonnez, désarmez, faites trébucher. Vous échangez de la puissance brute contre des tours qu'il ne jouera jamais — et un ultime interrompu au bon moment vaut mieux que n'importe quel coup critique.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      { art: "/game/UI/combat/character-abilities/fiel-de-vipere.avif", nom: "Fiel de vipère", effet: "venin qui se cumule au saignement", recharge: 4, niveau: 7 },
      { art: "/game/UI/combat/character-abilities/croc-en-jambe.avif", nom: "Croc-en-jambe", effet: "un tour volé, aucun dégât", recharge: 5, niveau: 11 },
      { art: "/game/UI/combat/character-abilities/desarmer.avif", nom: "Désarmer", effet: "force brisée · 3 tours", recharge: 4, niveau: 27 },
      { art: "/game/UI/combat/character-abilities/coup-de-crosse.avif", nom: "Coup de crosse", effet: "frappe et prend deux tours", recharge: 6, niveau: 50 },
    ],
  },
  {
    cle: "soins",
    chaine: "Tenir la distance",
    onglet: "Soins",
    carte: "/game/UI/campagne/tactic/cards/patiente.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Le combat long",
    accent: "se gagne debout.",
    texte:
      "Un pansement coûte un tour d'attaque, et c'est souvent le meilleur tour du combat. Refermez-vous peu à peu, purgez le poison qui vous ronge, et gardez la Main de grâce pour le soin qui doit compter : elle ne prend même pas votre tour.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      { art: "/game/UI/combat/character-abilities/pansement.avif", nom: "Pansement", effet: "près d'un cinquième de la vie", recharge: 4, niveau: 5 },
      { art: "/game/UI/combat/character-abilities/second-souffle.avif", nom: "Second souffle", effet: "se referme quatre tours durant", recharge: 5, niveau: 17 },
      { art: "/game/UI/combat/character-abilities/main-de-grace.avif", nom: "Main de grâce", effet: "sans prendre le tour · soin critique", recharge: 5, niveau: 25 },
      { art: "/game/UI/combat/character-abilities/purification.avif", nom: "Purification", effet: "retire ce qui vous ronge", recharge: 4, niveau: 30 },
    ],
  },
];
