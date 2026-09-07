import type { Onglet, Repere } from "./types";

/**
 * Quatre manières d'entrer dans un combat, et quatre coups pour chacune.
 *
 * Les compétences sont celles du jeu, avec leurs noms et leurs textes — vingt-
 * deux en tout, réparties ici en quatre familles selon ce qu'elles font. Ce
 * n'est pas un classement inventé pour la vitrine : une Grande parade et une
 * Riposte servent le même propos, une Lame enduite et un Fiel de vipère aussi,
 * et c'est cette parenté que les quatre onglets donnent à voir.
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
   * La planche de la tactique, telle que le jeu la dessine.
   *
   * Elle a servi de vignette, puis plus du tout — le champ est resté déclaré
   * et rempli pendant quatre versions sans que rien ne l'affiche. Elle revient
   * en bandeau du panneau de rotation, fondue par les bords : c'est la
   * décoration légère que le panneau réclamait, et elle existe déjà.
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
 * La scène montrait quatre coups et rien d'autre : on voyait de belles
 * planches sans savoir combien il y en a, ni contre quoi on les joue. Ces
 * quatre nombres sortent du contenu — vingt-deux compétences dans
 * `abilities.ts`, cinq places de barre dans `MAX_ABILITY_SLOTS`, cent vingt
 * créatures et huit boss dans le bestiaire.
 *
 * Quatre et non cinq. Les vingt particularités de `MonsterTrait` en faisaient
 * partie ; à cinq, la rangée dépassait la colonne du texte sur un portable et
 * passait à la ligne, son dernier filet pendu au bout du premier rang. Ce
 * qu'elles disent, la scène de campagne le montre en entier — chaque boss y
 * porte les siennes avec leur effet en clair.
 */
export const CHIFFRES_COMBAT: Repere[] = [
  {
    art: "/game/UI/pages/inventaire/sections/inventory-arms.avif",
    valeur: "22",
    quoi: "compétences",
  },
  { art: "/game/UI/pages/inventaire/sections/defense.avif", valeur: "5", quoi: "emportées" },
  { art: "/game/UI/navigation/codex.avif", valeur: "120", quoi: "créatures" },
  { art: "/game/UI/navigation/haut-faits.avif", valeur: "8", quoi: "boss" },
];

/**
 * Comment on joue, en une phrase.
 *
 * Il y en avait deux : celle-ci, et une seconde sur les particularités des
 * créatures. La seconde disait, moins bien, ce que la scène de campagne montre
 * déjà — chaque boss y porte ses particularités avec leur effet en clair. Deux
 * fois la même chose à deux sections d'écart, et la plus longue des deux
 * repoussait les quatre coups en bas de colonne.
 */
export const REGLE_COMBAT =
  "Un combat se joue au tour par tour : cinq compétences emportées sur vingt-deux, une action par tour, et des effets qui continuent d'agir quand on ne fait plus rien.";

export const TACTIQUES: Tactique[] = [
  {
    cle: "agressive",
    chaine: "Chaîne de dégâts",
    onglet: "Agressive",
    carte: "/game/UI/campagne/tactic/cards/agressive.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Frappez d'abord.",
    accent: "Terminez avant lui.",
    texte:
      "Prenez l'initiative et gardez-la tant que les coups portent. Coup lourd, brise-garde, exécution : l'approche agressive écourte les combats et transforme un adversaire blessé en adversaire mort. Encore faut-il le blesser le premier.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      {
        art: "/game/UI/combat/character-abilities/coup-lourd.avif",
        nom: "Coup lourd",
        effet: "tout le poids du corps",
        recharge: 3,
        niveau: 3,
      },
      {
        art: "/game/UI/combat/character-abilities/brise-garde.avif",
        nom: "Brise-garde",
        effet: "armure trouée · 3 tours",
        recharge: 4,
        niveau: 8,
      },
      {
        art: "/game/UI/combat/character-abilities/execution.avif",
        nom: "Exécution",
        effet: "coup double sous 33 % de vie",
        recharge: 6,
        niveau: 55,
      },
      {
        art: "/game/UI/combat/character-abilities/fureur.avif",
        nom: "Fureur",
        effet: "deux frappes et demie · saignement",
        recharge: 6,
        niveau: 60,
      },
    ],
  },
  {
    cle: "defensive",
    chaine: "Mur et riposte",
    onglet: "Défensive",
    carte: "/game/UI/campagne/tactic/cards/defensive.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Encaissez,",
    accent: "puis rendez le double.",
    texte:
      "Laissez venir, absorbez, et rendez au moment où il se découvre. Garde, rempart, riposte : contre les créatures qui frappent fort et rarement, c'est l'approche qui vous offre une seconde chance — et souvent la victoire.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      {
        art: "/game/UI/combat/character-abilities/garde.avif",
        nom: "Garde",
        effet: "un quart des coups en moins",
        recharge: 3,
        niveau: 1,
      },
      {
        art: "/game/UI/combat/character-abilities/rempart.avif",
        nom: "Rempart",
        effet: "trois tours retranché",
        recharge: 5,
        niveau: 24,
      },
      {
        art: "/game/UI/combat/character-abilities/riposte.avif",
        nom: "Riposte",
        effet: "rend la moitié encaissée",
        recharge: 4,
        niveau: 34,
      },
      {
        art: "/game/UI/combat/character-abilities/grande-parade.avif",
        nom: "Grande parade",
        effet: "six coups sur dix évités",
        recharge: 6,
        niveau: 42,
      },
    ],
  },
  {
    cle: "patiente",
    chaine: "Chaîne d'usure",
    onglet: "Patiente",
    carte: "/game/UI/campagne/tactic/cards/patiente.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Le temps",
    accent: "travaille pour vous.",
    texte:
      "Poisons, saignements, usure. Empilez ce qui continue d'agir pendant que vous ne faites rien, et regardez fondre les créatures que personne n'arrive à percer de front : le venin ignore les cuirasses.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      {
        art: "/game/UI/combat/character-abilities/entaille.avif",
        nom: "Entaille",
        effet: "saigne, et traverse les cuirasses",
        recharge: 2,
        niveau: 2,
      },
      {
        art: "/game/UI/combat/character-abilities/lame-enduite.avif",
        nom: "Lame enduite",
        effet: "poison · quatre tours",
        recharge: 4,
        niveau: 14,
      },
      {
        art: "/game/UI/combat/character-abilities/fiel-de-vipere.avif",
        nom: "Fiel de vipère",
        effet: "venin qui se cumule au saignement",
        recharge: 4,
        niveau: 7,
      },
      {
        art: "/game/UI/combat/character-abilities/saignee.avif",
        nom: "Saignée",
        effet: "frappe et rend la moitié prise",
        recharge: 5,
        niveau: 46,
      },
    ],
  },
  {
    cle: "distance",
    chaine: "Portée et tours volés",
    onglet: "À distance",
    carte: "/game/UI/campagne/tactic/cards/a-distance.avif",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Volez-lui",
    accent: "les tours qui comptent.",
    texte:
      "Tirez, désarmez, faites trébucher. Vous échangez de la puissance brute contre des tours qu'il ne jouera jamais — et un ultime interrompu au bon moment vaut mieux que n'importe quel coup critique.",
    chiffres: CHIFFRES_COMBAT,
    coups: [
      {
        art: "/game/UI/combat/character-abilities/volee.avif",
        nom: "Volée",
        effet: "deux frappes, deux critiques",
        recharge: 4,
        niveau: 38,
      },
      {
        art: "/game/UI/combat/character-abilities/croc-en-jambe.avif",
        nom: "Croc-en-jambe",
        effet: "un tour volé, aucun dégât",
        recharge: 5,
        niveau: 11,
      },
      {
        art: "/game/UI/combat/character-abilities/coup-de-crosse.avif",
        nom: "Coup de crosse",
        effet: "frappe et prend deux tours",
        recharge: 6,
        niveau: 50,
      },
      {
        art: "/game/UI/combat/character-abilities/desarmer.avif",
        nom: "Désarmer",
        effet: "force brisée · 3 tours",
        recharge: 4,
        niveau: 27,
      },
    ],
  },
];
