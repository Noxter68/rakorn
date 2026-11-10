/**
 * Ce qui n'appartient à aucune scène en particulier : l'ouverture, la
 * fermeture, la barre du haut, et les chiffres du monde.
 */

/**
 * Où mènent les boutons.
 *
 * Avant l'ouverture, nulle part : ils ouvrent la fenêtre où l'on laisse son
 * adresse. Un bouton « Jouer » qui mènerait à un jeu fermé dépenserait, en une
 * seconde, la confiance que neuf scènes viennent de bâtir.
 *
 * Ouverte (`BETA_OUVERTE`), ils mènent au jeu (`URL_DU_JEU`,
 * `lib/landing/ouverture.ts`).
 */

/**
 * La bêta est-elle ouverte ? Un interrupteur, et non l'heure du navigateur :
 * c'est le déploiement qui ouvre les portes. La page construite contient
 * alors directement le bouton du jeu — ni attente, ni bascule visible au
 * chargement —, et l'on choisit l'instant en poussant.
 */
export const BETA_OUVERTE = true;

/**
 * L'ouverture de la bêta : le 24 octobre, à dix-huit heures, heure de Paris.
 * Écrite avec son décalage plutôt qu'en UTC : c'est l'heure qu'on annonce, et
 * c'est elle qu'on doit pouvoir relire ici. Encore l'heure d'été (+02:00) —
 * la France passe à l'heure d'hiver le lendemain, dans la nuit du 24 au 25 ;
 * une date déplacée après le 25 devra passer à +01:00.
 *
 * Le compte à rebours et les deux textes qui citent la date la lisent tous
 * trois : on la déplace ici, et la page entière suit.
 */
export const OUVERTURE_BETA = "2026-10-24T18:00:00+02:00";

/** La date, telle qu'on l'écrit dans une phrase : « 13 octobre à 18 h ». */
export const DATE_BETA = (() => {
  const jour = new Date(OUVERTURE_BETA);
  const paris = { timeZone: "Europe/Paris" } as const;
  const date = new Intl.DateTimeFormat("fr-FR", { ...paris, day: "numeric", month: "long" }).format(jour);
  const heure = new Intl.DateTimeFormat("fr-FR", { ...paris, hour: "numeric" }).format(jour);
  return `${date} à ${heure}`;
})();

/** L'emblème, muet — les deux planches gravées portent l'ancien nom du jeu. */
export const EMBLEME = "/game/UI/icons/logo/rakorn-logo.avif";

/**
 * Le serveur Discord : la seule porte qui soit déjà ouverte.
 *
 * C'est aussi le seul lien sortant de la page, et il vaut donc une exception
 * à la règle ci-dessus — il ne promet pas une partie, il offre un endroit où
 * attendre l'ouverture avec les autres. Il paraît deux fois, dans la barre et
 * au pied, comme le bouton d'inscription.
 */
export const DISCORD = {
  href: "https://discord.gg/kGN4ChMKgC",
  libelle: "Discord",
  /** Le libellé complet, pour qui n'a que l'icône sous les yeux. */
  titre: "Rejoindre le serveur Discord",
};

/** Les ancres de la barre du haut, dans l'ordre où la page les déroule. */
export const NAVIGATION = [
  { href: "#metiers", libelle: "Métiers", icone: "/game/UI/navigation-v4/metiers.avif" },
  { href: "#marche", libelle: "Marché", icone: "/game/UI/navigation-v4/marche.avif" },
  { href: "#equipement", libelle: "Équipement", icone: "/game/UI/navigation-v4/inventaire.avif" },
  { href: "#combat", libelle: "Combat", icone: "/game/UI/navigation-v4/talent.avif" },
  { href: "#campagne", libelle: "Campagne", icone: "/game/UI/navigation-v4/campagne.avif" },
  { href: "#conquete", libelle: "Conquête", icone: "/game/UI/navigation-v4/haut-faits.avif" },
  { href: "#guilde", libelle: "Guilde", icone: "/game/UI/navigation-v4/guilde.avif" },
];

export const HERO = {
  /* Le paysage home-v1 du jeu, derrière les quatre écrans d'ouverture. */
  fond: "/game/UI/pages/home/home-v1.avif",
  surtitre: "Jeu de rôle · navigateur ordinateur et mobile · application à venir",
  /** Trois mots, trois lignes. Le deuxième est en or. */
  titre: ["Récoltez.", "Forgez.", "Vendez."] as const,
  /**
   * Une phrase, dans cet ordre : ce qu'on y fait, puis ce qui le distingue.
   *
   * « Aucun marchand ne décide à votre place » est une bonne accroche pour
   * qui sait déjà de quel genre de jeu on parle, et n'apprend rien à qui
   * arrive : on dit d'abord de quoi il s'agit, l'argument vient après. Le
   * genre, lui, est dans le surtitre — la phrase le répétait mot pour mot.
   *
   * Elle faisait deux paragraphes, posés à gauche sur six lignes. Centrée
   * au-dessus de la vitrine, chaque ligne de texte repousse l'écran d'autant
   * sous le pli ; et l'écran du Marché, juste dessous, montre mieux qu'une
   * phrase que les prix sont ceux des joueurs.
   */
  texte:
    "Huit métiers à monter, cent vingt créatures à vaincre au tour par tour, une cité à bâtir en guilde. Jouez dès maintenant dans votre navigateur, sur ordinateur ou sur mobile ; une application mobile viendra plus tard.",
  action: "Entrer dans Rakorn",
  actionSecondaire: "Découvrir",
};

export const CAPTURES_OUVERTURE = [
  {
    label: "Marché", icone: "/game/UI/navigation-v4/marche.avif",
    image: "/captures/ouverture-marche.avif", mobile: "/captures/ouverture-marche-mobile.avif",
    alt: "Le Marché de Rakorn avec les offres du comptoir et des joueurs.",
  },
  {
    label: "Compétences", icone: "/game/UI/navigation-v4/talent.avif",
    image: "/captures/jeu-competences.avif", mobile: "/captures/jeu-competences-mobile.avif",
    alt: "L'Ordre de bataille et les techniques du personnage.",
  },
  {
    label: "Forge", icone: "/game/UI/navigation-v4/forge.avif",
    image: "/captures/jeu-forge.avif", mobile: "/captures/jeu-forge-mobile.avif",
    alt: "La Forge de Rakorn et ses outils pour améliorer l'équipement.",
  },
  {
    label: "Combat", icone: "/game/UI/navigation-v4/campagne.avif",
    image: "/captures/ouverture-combat.avif", mobile: "/captures/ouverture-combat-mobile.avif",
    alt: "Une scène de combat de Rakorn contre un bandit chevronné.",
  },
] as const;

/**
 * Les chiffres du monde, relevés dans la base et non arrondis pour la vitrine.
 *
 * Ils passent en une seule ligne au pied de l'ouverture, et non dans un
 * bandeau de compteurs : une promesse se vérifie en dix minutes de jeu, elle
 * n'a pas besoin d'un encadré pour être crue.
 */
export const CHIFFRES = [
  { valeur: "8", quoi: "métiers" },
  { valeur: "461", quoi: "objets" },
  { valeur: "313", quoi: "recettes" },
  { valeur: "111", quoi: "filons" },
  { valeur: "120", quoi: "créatures" },
  { valeur: "1 001", quoi: "hauts faits" },
];

/**
 * La seule scène où plusieurs éléments paraissent ensemble.
 *
 * Elle sert de teaser final : tout ce que la page n'a pas eu le temps de
 * déplier, en une ligne chacun. C'est l'exception qui rend le reste tenable —
 * huit scènes plein écran plus une grille, et non neuf grilles.
 */
export const AUTRES = {
  fond: "/game/UI/pages/inventaire/background-inventaire.avif",
  surtitre: "09 — Et encore",
  titre: "Et il vous restera",
  accent: "tout ça à découvrir.",
  texte:
    "Huit systèmes de plus, que vous croiserez dans vos premières heures de jeu. Aucun n'est un bonus payant ni une récompense lointaine : ils sont là, ouverts, dès que vous en avez l'usage.",
  entrees: [
    {
      art: "/game/UI/navigation-v4/haut-faits.avif",
      nom: "Hauts faits",
      texte: "Mille un à décrocher, et les titres que vous porterez ensuite sous votre nom.",
    },
    {
      art: "/game/UI/navigation-v4/codex.avif",
      nom: "Codex",
      texte: "461 fiches pour ne jamais chercher : d'où vient une matière, à quoi sert une pièce.",
    },
    {
      art: "/game/UI/navigation-v4/talent.avif",
      nom: "Compétences",
      texte: "Préparez vos techniques et leur ordre avant le prochain combat.",
    },
    {
      art: "/game/UI/navigation-v4/contrats.avif",
      nom: "Commandes",
      texte: "Faites fabriquer ce que vous ne savez pas faire, ou fabriquez pour les autres.",
    },
    {
      art: "/game/UI/pages/inventaire/sections/recycler-v2.avif",
      nom: "Recyclage",
      texte: "Rien ne se perd : ce qui ne sert plus repart en matière première.",
    },
    {
      art: "/game/UI/pages/inventaire/sections/objets-rares-v2.avif",
      nom: "Sertissage",
      texte: "Des châsses à remplir, et la prime d'harmonie quand trois couleurs s'accordent.",
    },
    {
      art: "/game/UI/navigation-v4/inventaire.avif",
      nom: "Le sac",
      texte: "Quinze emplacements au départ, et autant que vous saurez en fabriquer ensuite.",
    },
    {
      art: "/game/UI/navigation-v4/forge.avif",
      nom: "Maison de Maître",
      texte: "Recherches, traitements et forge magistrale : ce qui vous attend au niveau 60.",
    },
  ],
};

export const FINAL = {
  /* Le décor login.png du jeu, servi dans sa variante AVIF légère. */
  fond: "/game/UI/pages/home/login.avif",
  surtitre: "Votre place vous attend",
  titre: "Commencez avec presque rien.",
  accent: "Bâtissez tout le reste.",
  texte:
    `Dix visages, deux métiers à choisir, quinze emplacements dans le sac et mille pièces d'or pour démarrer. Rakorn ouvre sa bêta le ${DATE_BETA} : laissez votre adresse, et vous serez prévenu à l'heure où la vallée s'ouvre.`,
  /* Ce que la scène dit une fois les portes ouvertes (`SelonOuverture`). */
  texteOuvert:
    "Dix visages, deux métiers à choisir, quinze emplacements dans le sac et mille pièces d'or pour démarrer. La bêta est ouverte : les cinquante premiers héros reçoivent un titre que nul autre ne gagnera, du Premier au Cinquantième Pionnier de Rakorn.",
  action: "Rejoindre la bêta",
};

/**
 * Ce que dit la fenêtre d'inscription.
 *
 * Elle répète le titre du bouton qu'on vient de presser — c'est voulu : une
 * fenêtre qui s'ouvre sur un autre titre que celui qu'on a cliqué donne une
 * demi-seconde de doute sur ce qu'on est en train de faire, et c'est une
 * demi-seconde de trop au moment de donner son adresse.
 */
export const BETA = {
  titre: "Rejoindre la bêta",
  texte:
    `Rakorn ouvre ses portes à un premier groupe de joueurs le ${DATE_BETA}. Laissez votre adresse : vous serez prévenu à l'heure où la vallée s'ouvre.`,
  action: "Je m'inscris",
  /* Sous le champ, en permanence. Dire ce qu'on fera de l'adresse coûte une
     ligne et lève la seule question que se pose quelqu'un qui hésite à la
     donner — bien plus efficacement qu'une case à cocher, qui pose la
     question sans y répondre. */
  mention: "Une adresse, un seul message le jour de l'ouverture. Rien d'autre.",
};
