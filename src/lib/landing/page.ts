/**
 * Ce qui n'appartient à aucune scène en particulier : l'ouverture, la
 * fermeture, la barre du haut, et les chiffres du monde.
 */

/**
 * Où mènent les boutons.
 *
 * Nulle part, désormais : ils descendent à `#final`, où l'on demande une
 * adresse. Ils ont pointé vers le `/register` du jeu tant qu'on a cru pouvoir
 * ouvrir tout de suite — mais un bouton « Jouer » qui mène à un jeu fermé
 * dépense, en une seconde, la confiance que neuf scènes viennent de bâtir. Il
 * n'y a donc plus de lien sortant, et plus de `NEXT_PUBLIC_JEU_URL` : le jour
 * de l'ouverture, on rebranchera les trois `href` sur le jeu, ce qui est une
 * ligne par bouton.
 */

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
  { href: "#metiers", libelle: "Métiers" },
  { href: "#marche", libelle: "Marché" },
  { href: "#equipement", libelle: "Équipement" },
  { href: "#combat", libelle: "Combat" },
  { href: "#campagne", libelle: "Campagne" },
  { href: "#carte", libelle: "Carte" },
  { href: "#guilde", libelle: "Guilde" },
];

export const HERO = {
  /* Le décor de l'accueil du jeu, version jour : la première image de la
     vitrine est celle qu'on retrouvera en se connectant. */
  fond: "/game/UI/pages/home/home-v2.avif",
  surtitre: "Jeu de rôle · artisanat et commerce · dans le navigateur",
  /** Trois mots, trois lignes. Le deuxième est en or. */
  titre: ["Récoltez.", "Forgez.", "Vendez."] as const,
  /**
   * Deux paragraphes, dans cet ordre : ce que c'est, puis ce qui le distingue.
   *
   * L'ouverture n'annonçait que le second. « Aucun marchand ne décide à votre
   * place » est une bonne accroche pour qui sait déjà de quel genre de jeu on
   * parle, et n'apprend rien à qui arrive : ni qu'on y monte des métiers, ni
   * qu'on s'y bat au tour par tour, ni qu'il n'y a rien à installer. On dit
   * d'abord de quoi il s'agit ; l'argument vient après.
   *
   * Deux phrases, pas deux paragraphes. La première version disait la même
   * chose en deux fois plus de mots — huit chapitres, on récolte, on fabrique,
   * on revend, et chaque prix décidé par celui qui vend — et une ouverture
   * qu'on lit en entier avant de voir le monde derrière n'est plus une
   * ouverture.
   */
  texte: [
    "Un jeu de rôle d'artisanat et de commerce, dans votre navigateur, sans rien à installer. Huit métiers à monter, cent vingt créatures à vaincre au tour par tour, une cité à bâtir avec votre guilde.",
    "Et une économie qui vous appartient : chaque matière a été extraite par un joueur, chaque pièce forgée par un autre, et c'est vous qui fixez vos prix.",
  ],
  action: "Rejoindre la bêta",
  actionSecondaire: "Découvrir",
};

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
      art: "/game/UI/navigation/haut-faits.avif",
      nom: "Hauts faits",
      texte: "Mille un à décrocher, et les titres que vous porterez ensuite sous votre nom.",
    },
    {
      art: "/game/UI/navigation/codex.avif",
      nom: "Codex",
      texte: "461 fiches pour ne jamais chercher : d'où vient une matière, à quoi sert une pièce.",
    },
    {
      art: "/game/UI/navigation/competences.avif",
      nom: "Compétences",
      texte: "Douze compétences, trois branches, cinq rangs — et une manière de jouer par arbre.",
    },
    {
      art: "/game/UI/navigation/contrats.avif",
      nom: "Commandes",
      texte: "Faites fabriquer ce que vous ne savez pas faire, ou fabriquez pour les autres.",
    },
    {
      art: "/game/UI/pages/inventaire/sections/recyclage.avif",
      nom: "Recyclage",
      texte: "Rien ne se perd : ce qui ne sert plus repart en matière première.",
    },
    {
      art: "/game/UI/pages/inventaire/sections/sertissage.avif",
      nom: "Sertissage",
      texte: "Des châsses à remplir, et la prime d'harmonie quand trois couleurs s'accordent.",
    },
    {
      art: "/game/UI/pages/inventaire/sections/sac.avif",
      nom: "Le sac",
      texte: "Quinze emplacements au départ, et autant que vous saurez en fabriquer ensuite.",
    },
    {
      art: "/game/UI/navigation/forge.avif",
      nom: "Maison de Maître",
      texte: "Recherches, traitements et forge magistrale : ce qui vous attend au niveau 60.",
    },
  ],
};

export const FINAL = {
  /* La même vallée qu'à l'ouverture, mais de nuit — le jeu en fait autant
     passé dix-huit heures. La page s'ouvre au couchant et se ferme à la nuit
     tombée : c'est le seul rappel visuel entre son premier écran et son
     dernier, et il ne coûte rien qu'un autre fichier. */
  fond: "/game/UI/pages/home/home-night.avif",
  surtitre: "Votre place vous attend",
  titre: "Commencez avec presque rien.",
  accent: "Bâtissez tout le reste.",
  texte:
    "Dix visages, deux métiers à choisir, quinze emplacements dans le sac et mille pièces d'or pour démarrer. Rakorn ouvre bientôt en bêta : laissez votre adresse, et vous serez prévenu le jour où la vallée s'ouvre.",
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
    "Rakorn ouvre bientôt ses portes à un premier groupe de joueurs. Laissez votre adresse : vous serez prévenu le jour où la vallée s'ouvre.",
  action: "Je m'inscris",
  /* Sous le champ, en permanence. Dire ce qu'on fera de l'adresse coûte une
     ligne et lève la seule question que se pose quelqu'un qui hésite à la
     donner — bien plus efficacement qu'une case à cocher, qui pose la
     question sans y répondre. */
  mention: "Une adresse, un seul message le jour de l'ouverture. Rien d'autre.",
};
