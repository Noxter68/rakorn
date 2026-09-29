import type { Onglet } from "./types";

/**
 * Le trajet d'une pièce : forgée, traitée, sertie, portée.
 *
 * Le décor ne change pas d'un onglet à l'autre — c'est une seule scène, et
 * c'est le mur de la Maison de Maître, pour que des pièces d'acier sombre
 * puissent s'y voir.
 *
 * **Chaque onglet dit ce que la chose fait.** La première version montrait
 * quatre illustrations et leur nom : on voyait de belles pièces sans savoir si
 * elles étaient bonnes, ce qu'un traitement changeait, ni à quoi servait une
 * gemme. Une vitrine de jeu d'équipement qui ne montre aucune statistique
 * n'annonce rien. Les fiches sont donc celles du jeu, capturées ; les
 * traitements et les gemmes, qui n'ont pas de fiche d'objet, portent leurs
 * chiffres en clair.
 */

/** La rareté décide de la couleur du nom, comme partout dans le jeu. */
export type Rarete = "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface PieceForge {
  art: string;
  nom: string;
  rarete: Rarete;
  /** Ce à quoi elle sert, en une ligne. */
  role: string;
  /** La clé de sa fiche — voir `fiches.ts`. */
  fiche: string;
}

/** Un traitement de Maître : ce qu'il touche, et ce qu'il donne au dernier rang. */
export interface Traitement {
  art: string;
  nom: string;
  /** L'emplacement qu'il accepte. */
  piece: string;
  rangs: string;
  /** Le gain cumulé au rang maximum. */
  gain: string;
  texte: string;
}

/** Une pierre : sa couleur, ce qu'elle donne par rang, et son accord. */
export interface Gemme {
  art: string;
  nom: string;
  parRang: string;
  auRangCinq: string;
  harmonie: string;
  fiche: string;
}

/**
 * Un poste de l'atelier : où l'on se tient, et ce qui en sort.
 *
 * L'onglet « Fabriquer » ne montre plus quatre pièces en file mais **trois
 * postes** — la mine, l'établi, la forge. Quatre illustrations numérotées de
 * un à quatre se lisaient comme quatre objets du même genre ; trois postes
 * nommés d'un verbe se lisent comme un trajet, et c'est ce qu'un visiteur doit
 * comprendre avant tout le reste : on récolte, on transforme, on forge.
 */
export interface Poste {
  /** Ce qu'on y fait, à l'impératif — « Récoltez ». */
  verbe: string;
  /** Où, en quelques mots. */
  lieu: string;
  pieces: PieceForge[];
}

export interface EtapeForge extends Onglet {
  pieces?: PieceForge[];
  postes?: Poste[];
  /**
   * Ce qui passe d'un poste au suivant, un de moins que de postes.
   *
   * Relevé dans les recettes : cinq fers par lingot (`lingot_de_fer`), douze
   * lingots et deux aciers trempés par plastron (`plastron_du_sentinelle`).
   * Le plastron demande aussi des scories et de la fonte : « par plastron »
   * dit ce qu'il en coûte de ces deux-là, pas que la liste est close — « font
   * un plastron » l'aurait prétendu.
   */
  passages?: string[];
  /**
   * La fiche posée tant qu'on ne survole rien. Par défaut, celle de la
   * dernière pièce ; l'atelier montre plutôt le plastron, parce que c'est
   * l'armure qu'il promet.
   */
  defaut?: string;
  traitements?: Traitement[];
  gemmes?: Gemme[];
  /**
   * Ce que la chose *est*, posé dans la colonne que la liste laisse libre.
   *
   * Deux onglets en ont besoin pour des raisons opposées. Les traitements
   * n'ont rien à révéler au survol — la colonne resterait vide. Le sertissage,
   * lui, montrait quatre pierres et leurs chiffres sans jamais dire ce qu'est
   * une châsse ni pourquoi on en veut : on lisait « +160 Vie » sans savoir où
   * cela se pose.
   */
  explication?: { titre: string; texte: string[] };
  /** Les trois systèmes que la recette n'épuise pas — voir `APERCUS`. */
  apercus?: Apercu[];
  /**
   * Quatre formes, une par nature de contenu.
   *
   * `atelier` pose trois postes — récolter, transformer, forger — et la
   * recette qui passe de l'un à l'autre : c'est la seule disposition qui fasse
   * voir qu'une armure **vient** d'un filon, et c'est ce que le premier onglet
   * a à dire à qui arrive.
   *
   * `chaine` étale les quatre pièces d'une panoplie en une rangée numérotée ;
   * la fiche de la dernière tient la colonne de droite.
   *
   * `rangee` étale les quatre en largeur sans les enchaîner — les traitements
   * ne se suivent pas, ils s'appliquent.
   *
   * La colonne ne se justifie que pour les gemmes, dont chaque ligne porte une
   * échelle de cinq crans et deux chiffres : en rangée, cela ferait quatre
   * colonnes de texte trop étroites pour leur contenu.
   */
  disposition?: "colonne" | "rangee" | "chaine" | "atelier";
}

const FOND = "/game/house-master/background/background-master-house.avif";
const SURTITRE = "04 — Forge, traitements et gemmes";

const TRAITEMENTS: Traitement[] = [
  {
    art: "/game/house-master/recherches/forgeron/trempe-volcanique.avif",
    nom: "Trempe volcanique",
    piece: "Plastron",
    rangs: "3 rangs",
    gain: "+15 Armure · +3 Parade",
    texte:
      "Le plastron descend dans un bain qu'aucune eau ne refroidirait. Il en ressort dense, et les coups glissent dessus.",
  },
  {
    art: "/game/house-master/recherches/forgeron/gravure-draconique.avif",
    nom: "Gravure draconique",
    piece: "Arme",
    rangs: "1 rang",
    gain: "+1 châsse",
    texte:
      "Une écaille creusée à même la lame, taillée pour recevoir une pierre. Là où le métal s'arrête, la gravure continue.",
  },
  {
    art: "/game/house-master/recherches/forgeron/noyau-de-lave.avif",
    nom: "Noyau de lave",
    piece: "Bouclier",
    rangs: "3 rangs",
    gain: "+18 Armure · +6 Parade",
    texte:
      "Le bouclier garde un cœur de roche vive derrière sa face. Ce qui le frappe s'y perd au lieu de traverser.",
  },
  {
    art: "/game/house-master/recherches/forgeron/cementation-abyssale.avif",
    nom: "Cémentation abyssale",
    piece: "Toute pièce",
    rangs: "3 rangs",
    gain: "+30 % de durabilité",
    texte:
      "Des semaines enfouies dans un charbon qui n'a jamais vu le jour. Le carbone entre dans le métal, et n'en sort plus.",
  },
];

const GEMMES: Gemme[] = [
  {
    art: "/game/UI/pages/forge/gems/gem-red-2.avif",
    nom: "Rubis ardent",
    parRang: "+32 Vie par rang",
    auRangCinq: "+160 Vie",
    harmonie: "+220 Vie",
    fiche: "gemme_rubis_5",
  },
  {
    art: "/game/UI/pages/forge/gems/gem-blue-2.avif",
    nom: "Saphir des profondeurs",
    parRang: "+2 Armure par rang",
    auRangCinq: "+10 Armure",
    harmonie: "+13 Armure",
    fiche: "gemme_saphir_5",
  },
  {
    art: "/game/UI/pages/forge/gems/gem-yellow-2.avif",
    nom: "Topaze fulgurante",
    parRang: "+1 % Critique par rang",
    auRangCinq: "+5 % Critique",
    harmonie: "+5 % Critique",
    fiche: "gemme_topaze_5",
  },
  {
    art: "/game/UI/pages/forge/gems/gem-green-2.avif",
    nom: "Émeraude du rempart",
    parRang: "+1 % Parade par rang",
    auRangCinq: "+5 % Parade",
    harmonie: "+3 % Parade",
    fiche: "gemme_emeraude_5",
  },
];

/**
 * Ce qu'une recette ne dit pas encore, en trois lignes.
 *
 * Elles se posent sous l'atelier, et c'est tout leur propos :
 * la pièce qui sort de l'enclume n'est pas finie. Elle part chez un Maître,
 * elle revient sertie, et l'outil qui l'a faite s'améliore lui aussi. Sans ces
 * trois lignes, l'onglet « Fabriquer » se lit comme la totalité du système
 * quand il n'en est que le premier quart — les trois autres onglets le disent,
 * mais seulement à qui les ouvre.
 *
 * **Elles se servent dans les tableaux plutôt que de les recopier.** Le gain
 * d'une trempe et celui d'un saphir sont écrits une fois, dans leur onglet ;
 * les répéter ici, c'est deux nombres à changer le jour où l'équilibrage bouge,
 * et un des deux qu'on oubliera.
 */
export interface Apercu {
  art: string;
  /** Le nom du système — « Traitement », « Sertissage », « Outil ». */
  titre: string;
  nom: string;
  gain: string;
}

export const APERCUS: Apercu[] = [
  {
    art: TRAITEMENTS[0].art,
    titre: "Traitement",
    nom: TRAITEMENTS[0].nom,
    gain: TRAITEMENTS[0].gain,
  },
  {
    art: GEMMES[1].art,
    titre: "Sertissage",
    nom: GEMMES[1].nom,
    gain: `${GEMMES[1].auRangCinq} au rang V`,
  },
  {
    /* L'enclume de la barre du jeu : l'outil n'a pas d'illustration à lui,
       et c'est sous cet emblème qu'on le trouve en jouant. */
    art: "/game/UI/navigation/forge.avif",
    titre: "Outil",
    nom: "Cinq crans à la forge",
    gain: "−20 % de temps de fabrication",
  },
];

export const ETAPES_FORGE: EtapeForge[] = [
  {
    cle: "fabriquer",
    disposition: "atelier",
    apercus: APERCUS,
    onglet: "Fabriquer",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Récoltez, transformez,",
    accent: "forgez votre armure.",
    texte:
      "Tout part d'un filon. Le fer que vous en tirez devient lingot à l'établi, le lingot devient plastron à la forge — et chaque marche est un métier : le vôtre, ou celui d'un joueur à qui vous l'achetez. Trois cent treize recettes relient ainsi la matière brute à ce que vous porterez.",
    chiffres: [
      { art: "/game/UI/navigation/codex.avif", valeur: "313", quoi: "recettes" },
      { art: "/game/UI/navigation/forge.avif", valeur: "5", quoi: "crans d'outil" },
      { art: "/game/UI/pages/inventaire/sections/sertissage.avif", valeur: "3", quoi: "châsses" },
      { art: "/game/UI/navigation/competences.avif", valeur: "Survolez", quoi: "pour la fiche", survol: true },
    ],
    defaut: "plastron_du_sentinelle",
    passages: ["5 fers par lingot", "12 lingots et 2 aciers par plastron"],
    postes: [
      {
        verbe: "Récoltez",
        lieu: "Au filon, dans la Mine",
        pieces: [
          {
            art: "/game/ressources/mining/veins/filon-de-fer.avif",
            nom: "Fer",
            rarete: "uncommon",
            role: "La matière brute",
            fiche: "fer",
          },
        ],
      },
      {
        verbe: "Transformez",
        lieu: "À l'établi",
        pieces: [
          {
            art: "/game/ressources/mining/lingo/lingo-de-fer.avif",
            nom: "Lingot de fer",
            rarete: "uncommon",
            role: "Fondu par un mineur",
            fiche: "lingot_de_fer",
          },
          {
            art: "/game/ressources/forge/acier-trempe.avif",
            nom: "Acier trempé",
            rarete: "uncommon",
            role: "Allié par un forgeron",
            fiche: "acier_trempe",
          },
        ],
      },
      {
        verbe: "Forgez",
        lieu: "À la forge",
        pieces: [
          {
            art: "/game/ressources/forge/plastron_du_sentinelle.avif",
            nom: "Plastron du sentinelle",
            rarete: "rare",
            role: "Torse — une châsse",
            fiche: "plastron_du_sentinelle",
          },
          {
            art: "/game/ressources/forge/bouclier-du-bastion.avif",
            nom: "Bouclier du bastion",
            rarete: "rare",
            role: "Main gauche — une châsse",
            fiche: "bouclier_du_bastion",
          },
        ],
      },
    ],
  },
  {
    cle: "traiter",
    disposition: "rangee",
    onglet: "Traiter",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Ce qu'aucun artisan",
    accent: "ne pourra copier.",
    texte:
      "Les traitements de Maître se cumulent sur trois rangs et ne se retirent jamais. Votre pièce part, revient, et n'a plus rien à voir avec celle que le forgeron a sortie de l'enclume — c'est là que se creuse l'écart.",
    chiffres: [
      { art: "/game/UI/navigation/haut-faits.avif", valeur: "4", quoi: "traitements" },
      { art: "/game/UI/icons/xp.avif", valeur: "3", quoi: "rangs cumulés" },
      { art: "/game/UI/pages/inventaire/sections/recyclage.avif", valeur: "Sans", quoi: "retour" },
    ],
    traitements: TRAITEMENTS,
  },
  {
    cle: "sertir",
    explication: {
      titre: "Une châsse, et ce qu'on y met",
      texte: [
        "Une pièce d'équipement porte des châsses : des logements vides, taillés dans le métal. On y sertit une gemme, et sa statistique s'ajoute à celle de la pièce.",
        "Combien de châsses ? L'emplacement décide — trois sur une arme ou un plastron, deux sur un casque, une ceinture ou un bouclier — et la rareté plafonne : une pièce peu commune n'en a aucune, une rare une seule, une épique deux, une légendaire jusqu'à trois. Seize en tout sur un porteur entièrement équipé.",
        "La pierre, elle, se monte du rang I au rang V, et son effet monte du même pas à chaque cran.",
      ],
    },
    onglet: "Sertir",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Cinq rangs de pierres,",
    accent: "et la prime de l'accord.",
    texte:
      "Montez une pierre du rang I au rang V et son effet monte cinq fois avec elle. Alignez trois pierres de la même couleur sur une pièce et vous décrochez l'harmonie par-dessus — une pièce monochrome au rang II tient tête à une pièce panachée au rang III. À vous de choisir votre couleur.",
    chiffres: [
      { art: "/game/UI/pages/inventaire/sections/sertissage.avif", valeur: "5", quoi: "rangs, I à V" },
      { art: "/game/UI/pages/inventaire/sections/defense.avif", valeur: "16", quoi: "châsses" },
      { art: "/game/UI/navigation/competences.avif", valeur: "3", quoi: "pour l'harmonie" },
    ],
    gemmes: GEMMES,
  },
  {
    cle: "equiper",
    disposition: "chaine",
    onglet: "Équiper",
    fond: FOND,
    surtitre: SURTITRE,
    titre: "Douze pièces,",
    accent: "et la panoplie s'éveille.",
    texte:
      "Les bonus s'ouvrent par paliers de trois : trois pièces portées, six, neuf, douze. Chaque palier franchi se voit immédiatement sur votre fiche — et le douzième, on le croise assez rarement pour qu'il se remarque.",
    chiffres: [
      { art: "/game/UI/pages/inventaire/sections/sac.avif", valeur: "12", quoi: "pièces" },
      { art: "/game/UI/icons/xp.avif", valeur: "3 · 6 · 9 · 12", quoi: "paliers" },
      { art: "/game/UI/navigation/competences.avif", valeur: "Survolez", quoi: "pour la fiche", survol: true },
    ],
    pieces: [
      {
        art: "/game/ressources/armors/set-mythique/couronne_mythique.avif",
        nom: "Couronne du Serment",
        rarete: "mythic",
        role: "Tête — 2 châsses",
        fiche: "couronne_mythique",
      },
      {
        art: "/game/ressources/armors/set-mythique/plastron_mythique.avif",
        nom: "Plastron du Serment",
        rarete: "mythic",
        role: "Torse — 3 châsses",
        fiche: "plastron_mythique",
      },
      {
        art: "/game/ressources/armors/set-mythique/lame_mythique.avif",
        nom: "Lame du Serment",
        rarete: "mythic",
        role: "Arme — 3 châsses",
        fiche: "lame_mythique",
      },
      {
        art: "/game/ressources/armors/set-mythique/bouclier_mythique.avif",
        nom: "Pavois du Serment",
        rarete: "mythic",
        role: "Main gauche — 2 châsses",
        fiche: "bouclier_mythique",
      },
    ],
  },
];
