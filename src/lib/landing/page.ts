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
  { href: "#metiers", libelle: "Métiers" },
  { href: "#marche", libelle: "Marché" },
  { href: "#equipement", libelle: "Équipement" },
  { href: "#combat", libelle: "Combat" },
  { href: "#campagne", libelle: "Campagne" },
  { href: "#conquete", libelle: "Conquête" },
  { href: "#guilde", libelle: "Guilde" },
];

export const HERO = {
  /* Le fond de la page des Compétences : une nuit bleue qui s'éclaire au
     centre, juste derrière la vitrine. La vallée de l'accueil a tenu cette
     place tant que l'ouverture n'avait que du texte à porter ; devant une
     interface, ses couleurs lui disputaient l'œil. */
  fond: "/game/UI/pages/competences/background-skill.avif",
  /**
   * Le Marché, en vitrine sous le texte — prise par `pnpm captures marche`,
   * à 2 560 pixels : c'est la plus grande image de la page, et la première.
   */
  capture: "/captures/ouverture-marche.avif",
  captureAlt:
    "Le Marché de Rakorn : les objets en vente avec leur prix moyen, et la fiche de l'objet choisi.",
  surtitre: "Jeu de rôle · artisanat et commerce · dans le navigateur",
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
    "Huit métiers à monter, cent vingt créatures à vaincre au tour par tour, une cité à bâtir en guilde — et une économie qui vous appartient : chaque prix du Marché, c'est un joueur qui l'a fixé.",
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
      texte: "Trois arbres de talents, trois sources de points, et une clé de voûte au sommet de chacun.",
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
  /* La vallée de l'accueil du jeu, de nuit — celle qu'on retrouve en se
     connectant passé dix-huit heures. L'ouverture a quitté la vallée pour la
     vitrine du Marché : la page commence par ce qu'on fera, et finit par
     l'endroit où l'on arrivera. */
  fond: "/game/UI/pages/home/home-night.avif",
  surtitre: "Votre place vous attend",
  titre: "Commencez avec presque rien.",
  accent: "Bâtissez tout le reste.",
  texte:
    `Dix visages, deux métiers à choisir, quinze emplacements dans le sac et mille pièces d'or pour démarrer. Rakorn ouvre sa bêta le ${DATE_BETA} : laissez votre adresse, et vous serez prévenu à l'heure où la vallée s'ouvre.`,
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
