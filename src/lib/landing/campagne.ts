/**
 * La Route du Voyageur, telle que le jeu l'ouvre.
 *
 * Cette scène abandonne le gabarit des huit autres, et c'est délibéré : elle
 * reprend la mise en page de l'écran de campagne du jeu — le titre en haut à
 * gauche, la rangée de chapitres en bas, et à droite le panneau qui détaille
 * ce qui attend. Montrer un écran de jeu dans sa propre disposition en dit
 * plus qu'un texte qui le décrirait dans une autre.
 *
 * **Les chiffres viennent du jeu, un par un.** Attaque, armure, parade et
 * niveau attendu : relevés le 25 novembre 2026 sur l'API de campagne
 * (`/campaign/zones/:zone/levels`), tels que l'écran les affiche. La vie
 * vient de la migration `vie_des_boss_au_dessus` (6 novembre 2026), que le
 * semis n'écrit pas — sauf celle de Malachar, qu'aucune migration récente ne
 * touche. L'expérience est celle d'une première victoire, `xpBruteDeCombat`
 * au niveau attendu : `xpAward` ne règle plus que l'or. Un boss dont on
 * gonflerait les points de vie pour la vitrine se ferait démentir au premier
 * combat.
 *
 * Les portraits sont peints avec leur fond — c'est ce qui les rendait
 * impossibles à poser en surimpression sur une scène. Dans un médaillon rond
 * et dans une carte encadrée, ils redeviennent ce qu'ils sont : des tableaux.
 */

/*
 * Les chemins sont écrits en entier, jamais recomposés. Le script de synchro
 * ne relève que les chaînes littérales : un dossier factorisé rend l'image
 * invisible à son relevé, et elle manque à l'exécution sans que rien n'ait
 * échoué à la compilation.
 */
export interface Trait {
  nom: string;
  art: string;
  /** Ce que la particularité fait — jamais ce qui y répond. */
  quoi: string;
}

export interface Boss {
  cle: string;
  /** Le libellé de la carte, court. */
  onglet: string;
  nom: string;
  zone: string;
  /** Le chapitre, en chiffres romains. */
  chapitre: string;
  /** Le décor de la zone, qui prend l'écran quand on choisit ce boss. */
  fond: string;
  /** Le portrait peint, en médaillon et sur la carte. */
  art: string;
  /**
   * Le niveau **attendu**, celui que le jeu affiche.
   *
   * Ce n'est pas le rang dans la zone — tous les boss sont quinzièmes de la
   * leur, et écrire « niveau 15 » sur le Roi sous la Montagne annonçait un
   * gobelin là où se tient ce qui clôt la campagne. Il suit les bandes de
   * niveau des terres (`SEUILS_TERRES`), le rang quinze tenant le haut de la
   * sienne — voir `niveauxAttendus` côté API.
   */
  niveau: number;
  vie: number;
  attaque: number;
  armure: number;
  parade: number;
  xp: number;
  traits: Trait[];
  texte: string;
}

export const OUVERTURE = {
  surtitre: "06 — Campagne et exploration",
  titre: "Cent vingt créatures",
  accent: "entre vous et le Trône.",
  texte:
    "Huit chapitres, quinze combats chacun, vingt-quatre boss. Du village des apprentis au Trône sous la Montagne, chaque victoire ouvre une terre de plus, de meilleures matières et des recettes que personne autour de vous ne sait encore faire.",
  chiffres: [
    { valeur: "8", quoi: "zones" },
    { valeur: "120", quoi: "créatures" },
    { valeur: "24", quoi: "boss" },
  ],
};

export const BOSS: Boss[] = [
  {
    cle: "malachar",
    onglet: "Malachar",
    nom: "Malachar l'Ombre",
    zone: "Village des Apprentis",
    chapitre: "Chapitre I",
    fond: "/game/map/village-des-apprentis/village-des-apprentis.avif",
    art: "/game/map/village-des-apprentis/11-15/malachar-ombre.avif",
    niveau: 6,
    vie: 204,
    attaque: 38,
    armure: 22,
    parade: 10,
    xp: 220,
    traits: [
      { nom: "Rapide", art: "/game/UI/campagne/traits/rapide-2.avif", quoi: "Frappe avant qu'on ait fini de lever la garde." },
      { nom: "Spectral", art: "/game/UI/campagne/traits/spectral-2.avif", quoi: "L'acier le traverse à moitié." },
      { nom: "Embusqué", art: "/game/UI/campagne/traits/embusque-2.avif", quoi: "Attend qu'on ait tourné le dos." },
    ],
    texte:
      "On ne sait ni d'où il vient ni ce qu'il veut de cette vallée. Il apparaît là où la route se resserre, toujours au crépuscule, et frappe avant qu'on l'ait vu bouger.",
  },
  {
    cle: "rouvre",
    onglet: "Rouvre l'Ancien",
    nom: "Rouvre l'Ancien",
    zone: "Sylve de Rouvre",
    chapitre: "Chapitre III",
    fond: "/game/map/sylve-de-rouvre/sylve-de-rouvre.avif",
    art: "/game/map/sylve-de-rouvre/11-15/rouvre-ancien.avif",
    niveau: 20,
    vie: 2550,
    attaque: 58,
    armure: 3,
    parade: 5,
    xp: 276,
    traits: [
      { nom: "Colossal", art: "/game/UI/campagne/traits/colossal-2.avif", quoi: "Trop grand pour qu'on l'encercle, trop lourd pour qu'il vous suive." },
      { nom: "Cuirassé", art: "/game/UI/campagne/traits/cuirasse-2.avif", quoi: "Plaques, écailles, chitine : les coups francs glissent." },
      { nom: "Territorial", art: "/game/UI/campagne/traits/territorial-2.avif", quoi: "Chez lui, il connaît chaque pierre." },
    ],
    texte:
      "Le chêne dont la forêt porte le nom, réveillé et furieux. Sa sève brûle les plaies qu'elle touche, et l'écorce se referme aussi vite qu'on l'ouvre.",
  },
  {
    cle: "fendeval",
    onglet: "Fendeval",
    nom: "Fendeval, la crue",
    zone: "Gorges de Fendeval",
    chapitre: "Chapitre V",
    fond: "/game/map/gorges-de-fendeval/gorges-de-fendeval.avif",
    art: "/game/map/gorges-de-fendeval/11-15/fendeval-la-crue.avif",
    niveau: 36,
    vie: 4970,
    attaque: 121,
    armure: 18,
    parade: 26,
    xp: 340,
    traits: [
      { nom: "Colossal", art: "/game/UI/campagne/traits/colossal-2.avif", quoi: "Trop grand pour qu'on l'encercle, trop lourd pour qu'il vous suive." },
      { nom: "Rapide", art: "/game/UI/campagne/traits/rapide-2.avif", quoi: "Frappe avant qu'on ait fini de lever la garde." },
      { nom: "Enragé", art: "/game/UI/campagne/traits/enrage-2.avif", quoi: "Plus on l'entame, plus il frappe." },
    ],
    texte:
      "La gorge en colère, une masse d'eau debout qui garde la forme d'un homme. Elle arrive plus vite qu'on ne recule, et chaque entaille la fait monter.",
  },
  {
    cle: "sombrefer",
    onglet: "Sombrefer",
    nom: "Sombrefer, la fournaise",
    zone: "Profondeurs de Sombrefer",
    chapitre: "Chapitre VII",
    fond: "/game/map/profondeurs-de-sombrefer/profondeurs-de-sombrefer.avif",
    art: "/game/map/profondeurs-de-sombrefer/11-15/sombrefer-la-fournaise.avif",
    niveau: 52,
    vie: 6090,
    attaque: 248,
    armure: 20,
    parade: 33,
    xp: 404,
    traits: [
      { nom: "Colossal", art: "/game/UI/campagne/traits/colossal-2.avif", quoi: "Trop grand pour qu'on l'encercle, trop lourd pour qu'il vous suive." },
      { nom: "Ignifugé", art: "/game/UI/campagne/traits/ignifuge-2.avif", quoi: "Le feu ne lui fait rien, et il en porte souvent." },
      { nom: "Enragé", art: "/game/UI/campagne/traits/enrage-2.avif", quoi: "Plus on l'entame, plus il frappe." },
    ],
    texte:
      "Le cœur ardent de la montagne, dans une carcasse de métal en fusion. La flamme ne peut rien contre lui : sans huile de trempe, l'approcher est un suicide.",
  },
  {
    cle: "roi",
    onglet: "Le Roi",
    nom: "Le Roi sous la Montagne",
    zone: "Le Trône sous la Montagne",
    chapitre: "Chapitre VIII",
    fond: "/game/map/trone-sous-la-montagne/trone-sous-la-montagne.avif",
    art: "/game/map/trone-sous-la-montagne/11-15/le-roi-sous-la-montagne.avif",
    niveau: 60,
    vie: 5770,
    attaque: 395,
    armure: 66,
    parade: 53,
    xp: 436,
    traits: [
      { nom: "Colossal", art: "/game/UI/campagne/traits/colossal-2.avif", quoi: "Trop grand pour qu'on l'encercle, trop lourd pour qu'il vous suive." },
      { nom: "Cuirassé", art: "/game/UI/campagne/traits/cuirasse-2.avif", quoi: "Plaques, écailles, chitine : les coups francs glissent." },
      { nom: "Enragé", art: "/game/UI/campagne/traits/enrage-2.avif", quoi: "Plus on l'entame, plus il frappe." },
    ],
    texte:
      "Il s'est fait enterrer vivant avec son or plutôt que d'en céder une pièce. Chaque coup porté ne fait que l'attiser — sans fiole d'invulnérabilité, l'audience est courte.",
  },
];
