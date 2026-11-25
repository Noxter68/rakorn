/**
 * Les fiches d'objet, en données.
 *
 * La vitrine montrait des **captures** de l'infobulle du jeu. Une image ne
 * monte pas en taille : au double elle bavait, et c'est précisément la fiche
 * qu'on veut pouvoir agrandir, puisque c'est là qu'on lit ce qu'une pièce
 * vaut. Rendue en HTML, elle se met à l'échelle sans perdre un pixel et pèse
 * quelques centaines d'octets au lieu de huit kilos par objet.
 *
 * **Les chiffres sont ceux de la base**, relevés objet par objet : attaque,
 * armure, parade, critique, vie, durabilité, niveau de port, métier exigé,
 * paliers d'ensemble. Rien n'est arrondi pour la vitrine — une fiche qui
 * mentirait se ferait démentir à la première pièce ramassée.
 *
 * Deux choses sont mises en scène, et se voient : le nombre de pièces portées
 * d'un ensemble, et les gemmes serties sur le Marteau du Serment. Aucun visiteur
 * n'a de personnage ; il fallait bien décider ce qu'il porte pour que les
 * paliers et le sertissage aient quelque chose à montrer. Les valeurs, elles,
 * restent celles du jeu — trois topazes de rang V donnent bien cinq pour cent
 * de critique chacune, la prime de sertissage complet cinq d'attaque et cinq
 * d'armure, l'harmonie monochrome cinq de critique.
 */

export type Rarete = "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type StatCle = "attack" | "defense" | "parade" | "crit" | "hp";

export interface Palier {
  pieces: number;
  label: string;
  valeur: string;
}

export interface Fiche {
  nom: string;
  rarete: Rarete;
  /** « Casque », « Ressource » — la nature, à droite de la rareté. */
  nature: string;
  /** Le métier qui la fabrique et son palier. */
  metier: string;
  /** Niveau de port. Zéro pour ce qui ne s'équipe pas. */
  niveau: number;
  art: string;
  /** Châsses ouvertes : le minimum entre l'emplacement et la rareté. */
  chasses?: number;
  /** La dominante, en tête de fiche. */
  principale?: { stat: StatCle; valeur: number };
  secondaires?: { stat: StatCle; valeur: number }[];
  durabilite?: [number, number];
  /** Ce qu'une pierre donnera une fois sertie — pour les gemmes seules. */
  pierre?: string;
  gemmes?: { art: string; nom: string; effet: string }[];
  primes?: { label: string; texte: string }[];
  ensemble?: { nom: string; portees: number; paliers: Palier[] };
  flavour?: string;
  poincon?: string;
}

/**
 * Les quatre paliers de l'Ensemble du Roi sous la Montagne.
 *
 * Relevés dans `ItemSetBonus` le 25 novembre 2026 (et une première fois le
 * 29 septembre). Les chiffres d'avant
 * dataient d'un barème que le jeu a quitté — soixante-cinq d'armure au
 * troisième palier, quand la base en donne dix-neuf : la vitrine promettait
 * trois fois ce qu'une pièce ramassée tiendrait.
 */
const ROI: Palier[] = [
  { pieces: 3, label: "Armure", valeur: "+19" },
  { pieces: 6, label: "Attaque", valeur: "+38" },
  { pieces: 9, label: "Parade", valeur: "+14 %" },
  { pieces: 12, label: "Vie max", valeur: "+286" },
];

/** Ceux de l'Ensemble des Sylves Éternelles. */
const SYLVES: Palier[] = [
  { pieces: 3, label: "Critique", valeur: "+3 %" },
  { pieces: 6, label: "Attaque", valeur: "+24" },
  { pieces: 9, label: "Armure", valeur: "+36" },
  { pieces: 12, label: "Vie max", valeur: "+178" },
];

/** Ceux de l'Ensemble du Serment. */
const SERMENT: Palier[] = [
  { pieces: 3, label: "Attaque", valeur: "+30" },
  { pieces: 6, label: "Armure", valeur: "+60" },
  { pieces: 9, label: "Critique", valeur: "+22 %" },
  { pieces: 12, label: "Vie max", valeur: "+450" },
];

export const FICHES: Record<string, Fiche> = {
  // ── La quatrième marche de chaque métier ────────────────────────────────
  // Cinq métiers fabriquent des pièces d'ensemble — mineur, bûcheron,
  // forgeron, couturier, joaillier — et leur quatrième marche en montre une,
  // paliers compris : c'est ce que « Complétez l'ensemble » promet. Les trois
  // autres n'en font aucune, et leur marche montre leur pièce d'exception.
  couronne_du_roi_sous_la_montagne: {
    nom: "Couronne du Roi sous la Montagne",
    rarete: "legendary",
    nature: "Casque",
    metier: "Mineur niv. 53",
    niveau: 53,
    art: "/game/ressources/mining/craft/couronne-du-roi-sous-la-montagne.avif",
    principale: { stat: "defense", valeur: 47 },
    secondaires: [
      { stat: "attack", valeur: 16 },
      { stat: "parade", valeur: 3 },
      { stat: "crit", valeur: 3 },
      { stat: "hp", valeur: 64 },
    ],
    durabilite: [119, 120],
    ensemble: { nom: "Ensemble du Roi sous la Montagne", portees: 5, paliers: ROI },
  },
  arc_des_sylves_eternelles: {
    nom: "Arc des Sylves Éternelles",
    rarete: "epic",
    nature: "Main gauche",
    metier: "Bûcheron niv. 45",
    niveau: 45,
    art: "/game/ressources/armors/set-sylves_eternelles/arc_des_sylves_eternelles.avif",
    chasses: 2,
    principale: { stat: "attack", valeur: 36 },
    secondaires: [
      { stat: "defense", valeur: 12 },
      { stat: "crit", valeur: 3 },
      { stat: "hp", valeur: 30 },
    ],
    durabilite: [100, 100],
    ensemble: { nom: "Ensemble des Sylves Éternelles", portees: 4, paliers: SYLVES },
  },
  masse_du_roi_sous_la_montagne: {
    nom: "Masse du Roi sous la Montagne",
    rarete: "legendary",
    nature: "Arme",
    metier: "Forgeron niv. 50",
    niveau: 50,
    art: "/game/ressources/armors/set-roi_sous_la_montagne/masse_du_roi_sous_la_montagne.avif",
    chasses: 3,
    principale: { stat: "attack", valeur: 68 },
    secondaires: [
      { stat: "crit", valeur: 4 },
      { stat: "hp", valeur: 50 },
    ],
    durabilite: [120, 120],
    ensemble: { nom: "Ensemble du Roi sous la Montagne", portees: 5, paliers: ROI },
  },
  cape_du_roi_sous_la_montagne: {
    nom: "Cape du Roi sous la Montagne",
    rarete: "legendary",
    nature: "Cape",
    metier: "Couturier niv. 52",
    niveau: 52,
    art: "/game/ressources/armors/set-roi_sous_la_montagne/cape_du_roi_sous_la_montagne.avif",
    principale: { stat: "defense", valeur: 40 },
    secondaires: [
      { stat: "parade", valeur: 8 },
      { stat: "hp", valeur: 117 },
    ],
    durabilite: [120, 120],
    ensemble: { nom: "Ensemble du Roi sous la Montagne", portees: 5, paliers: ROI },
  },
  anneau_du_roi_sous_la_montagne: {
    nom: "Anneau du Roi sous la Montagne",
    rarete: "legendary",
    nature: "Anneau",
    metier: "Joaillier niv. 56",
    niveau: 56,
    art: "/game/ressources/armors/set-roi_sous_la_montagne/anneau_du_roi_sous_la_montagne.avif",
    principale: { stat: "attack", valeur: 48 },
    secondaires: [
      { stat: "defense", valeur: 22 },
      { stat: "crit", valeur: 10 },
    ],
    durabilite: [120, 120],
    ensemble: { nom: "Ensemble du Roi sous la Montagne", portees: 5, paliers: ROI },
  },
  elixir_de_regeneration_ancienne: {
    nom: "Élixir de régénération ancienne",
    rarete: "epic",
    nature: "Potion",
    metier: "Alchimiste niv. 48",
    niveau: 0,
    art: "/game/ressources/alchimist/elixir-de-regeneration-ancienne.avif",
  },
  nectar_de_l_arbre_du_monde: {
    nom: "Nectar de l'Arbre-Monde",
    rarete: "legendary",
    nature: "Potion",
    metier: "Alchimiste niv. 60",
    niveau: 0,
    art: "/game/ressources/alchimist/nectar-de-arbre-monde.avif",
  },
  coeur_d_architecte_runique: {
    nom: "Cœur d'architecte runique",
    rarete: "legendary",
    nature: "Cape",
    metier: "Ingénieur niv. 60",
    niveau: 60,
    art: "/game/ressources/enginering/coeur-architecte-runique.avif",
    principale: { stat: "defense", valeur: 58 },
    secondaires: [
      { stat: "parade", valeur: 10 },
      { stat: "hp", valeur: 142 },
    ],
    durabilite: [120, 120],
  },
  sceau_des_routes_franches: {
    nom: "Sceau des routes franches",
    rarete: "epic",
    nature: "Divers",
    metier: "Logisticien niv. 55",
    niveau: 0,
    art: "/game/ressources/logistician/sceau-des-routes-franches.avif",
    flavour:
      "Le cachet que reconnaissent les vingt-deux péages entre la Mine et les Marais. Il ne s'achète pas : il se mérite convoi après convoi, et il ouvre ce que l'or ne rouvre plus.",
  },

  tablee_du_trone: {
    nom: "Tablée du Trône",
    rarete: "epic",
    nature: "Tablée",
    metier: "Maître-queux niv. 58",
    niveau: 0,
    art: "/game/ressources/maitre-queux/banquets/tablee-du-trone.avif",
    flavour:
      "Posée au seuil de l'Ossuaire ou avant une expédition, elle fait cinq parts : chacun prend la sienne, et la garde deux heures.",
  },
  charte_specialisation: {
    nom: "Charte de spécialisation",
    rarete: "legendary",
    nature: "Divers",
    metier: "Logisticien niv. 60",
    niveau: 0,
    art: "/game/ressources/logistician/charte-de-specialisation.avif",
    flavour: "Le parchemin qui ouvre un troisième métier à qui la signe. Seul le logisticien sait la rédiger.",
  },

  // ── De la mine à l'armure ───────────────────────────────────────────────
  fer: {
    nom: "Fer",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Mineur niv. 3",
    niveau: 0,
    art: "/game/ressources/mining/veins/filon-de-fer.avif",
  },
  lingot_de_fer: {
    nom: "Lingot de fer",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Mineur niv. 3",
    niveau: 0,
    art: "/game/ressources/mining/lingo/lingo-de-fer.avif",
  },
  fonte_grise: {
    nom: "Fonte grise",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Forgeron niv. 20",
    niveau: 0,
    art: "/game/ressources/forge/coulee-de-fonte-grise.avif",
  },
  fonte_de_fer: {
    nom: "Fonte de fer",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Mineur niv. 14",
    niveau: 0,
    art: "/game/ressources/mining/lingo/fonte-de-fer.avif",
  },
  lingot_de_fonte_grise: {
    nom: "Lingot de fonte grise",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Forgeron niv. 20",
    niveau: 0,
    art: "/game/ressources/forge/lingot-de-fonte-grise.avif",
  },
  acier_trempe: {
    nom: "Acier trempé",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Forgeron niv. 15",
    niveau: 0,
    art: "/game/ressources/forge/acier-trempe.avif",
  },
  plastron_du_sentinelle: {
    nom: "Plastron du sentinelle",
    rarete: "rare",
    nature: "Plastron",
    metier: "Forgeron niv. 28",
    niveau: 28,
    art: "/game/ressources/forge/plastron_du_sentinelle.avif",
    principale: { stat: "defense", valeur: 22 },
    secondaires: [
      { stat: "parade", valeur: 1 },
      { stat: "hp", valeur: 47 },
    ],
    durabilite: [80, 80],
  },
  bouclier_du_bastion: {
    nom: "Bouclier du bastion",
    rarete: "rare",
    nature: "Main gauche",
    metier: "Forgeron niv. 37",
    niveau: 37,
    art: "/game/ressources/forge/bouclier-du-bastion.avif",
    principale: { stat: "defense", valeur: 25 },
    secondaires: [
      { stat: "parade", valeur: 3 },
      { stat: "hp", valeur: 20 },
    ],
    durabilite: [80, 80],
  },

  // ── La panoplie du Serment ──────────────────────────────────────────────
  couronne_mythique: {
    nom: "Couronne du Serment",
    rarete: "mythic",
    nature: "Casque",
    metier: "Mineur niv. 60",
    niveau: 60,
    art: "/game/ressources/armors/set-mythique/couronne_mythique.avif",
    chasses: 2,
    principale: { stat: "defense", valeur: 78 },
    secondaires: [
      { stat: "attack", valeur: 26 },
      { stat: "parade", valeur: 7 },
      { stat: "crit", valeur: 4 },
      { stat: "hp", valeur: 111 },
    ],
    durabilite: [150, 150],
    ensemble: { nom: "Ensemble du Serment", portees: 4, paliers: SERMENT },
  },
  plastron_mythique: {
    nom: "Plastron du Serment",
    rarete: "mythic",
    nature: "Plastron",
    metier: "Forgeron niv. 60",
    niveau: 60,
    art: "/game/ressources/armors/set-mythique/plastron_mythique.avif",
    chasses: 3,
    principale: { stat: "defense", valeur: 96 },
    secondaires: [
      { stat: "parade", valeur: 6 },
      { stat: "hp", valeur: 209 },
    ],
    durabilite: [150, 150],
    ensemble: { nom: "Ensemble du Serment", portees: 4, paliers: SERMENT },
  },
  lame_mythique: {
    nom: "Marteau du Serment",
    rarete: "mythic",
    nature: "Arme",
    metier: "Forgeron niv. 60",
    niveau: 60,
    art: "/game/ressources/armors/set-mythique/lame_mythique.avif",
    chasses: 3,
    principale: { stat: "attack", valeur: 106 },
    secondaires: [
      { stat: "crit", valeur: 10 },
      { stat: "hp", valeur: 120 },
    ],
    durabilite: [150, 150],
    gemmes: [
      {
        art: "/game/UI/pages/forge/gems/gem-yellow-2.avif",
        nom: "Topaze fulgurante V",
        effet: "+5 % Critique",
      },
      {
        art: "/game/UI/pages/forge/gems/gem-yellow-2.avif",
        nom: "Topaze fulgurante V",
        effet: "+5 % Critique",
      },
      {
        art: "/game/UI/pages/forge/gems/gem-yellow-2.avif",
        nom: "Topaze fulgurante V",
        effet: "+5 % Critique",
      },
    ],
    primes: [
      { label: "Sertissage complet", texte: "+5 Attaque · +5 Armure" },
      { label: "Harmonie Topaze fulgurante", texte: "+5 % Critique" },
    ],
    ensemble: { nom: "Ensemble du Serment", portees: 4, paliers: SERMENT },
    poincon: "Forgé par DORN — Maison Rougefer",
  },
  bouclier_mythique: {
    nom: "Pavois du Serment",
    rarete: "mythic",
    nature: "Main gauche",
    metier: "Forgeron niv. 60",
    niveau: 60,
    art: "/game/ressources/armors/set-mythique/bouclier_mythique.avif",
    chasses: 2,
    principale: { stat: "defense", valeur: 103 },
    secondaires: [
      { stat: "parade", valeur: 14 },
      { stat: "hp", valeur: 63 },
    ],
    durabilite: [150, 150],
    ensemble: { nom: "Ensemble du Serment", portees: 4, paliers: SERMENT },
  },

  // ── Les quatre pierres, au dernier rang ─────────────────────────────────
  gemme_rubis_5: {
    nom: "Rubis ardent V",
    rarete: "legendary",
    nature: "Gemme",
    metier: "Joaillier niv. 55",
    niveau: 0,
    art: "/game/UI/pages/forge/gems/gem-red-2.avif",
    pierre: "+160 Vie",
    flavour: "Une braise prise dans la pierre. Qui la porte tient plus longtemps debout.",
  },
  gemme_saphir_5: {
    nom: "Saphir des profondeurs V",
    rarete: "legendary",
    nature: "Gemme",
    metier: "Joaillier niv. 55",
    niveau: 0,
    art: "/game/UI/pages/forge/gems/gem-blue-2.avif",
    pierre: "+10 Armure",
    flavour: "Le bleu des galeries sans fond. Les coups y entrent moins profond.",
  },
  gemme_topaze_5: {
    nom: "Topaze fulgurante V",
    rarete: "legendary",
    nature: "Gemme",
    metier: "Joaillier niv. 55",
    niveau: 0,
    art: "/game/UI/pages/forge/gems/gem-yellow-2.avif",
    pierre: "+5 % Critique",
    flavour: "Elle cherche la faille et la trouve. Le coup juste part plus souvent.",
  },
  gemme_emeraude_5: {
    nom: "Émeraude du rempart V",
    rarete: "legendary",
    nature: "Gemme",
    metier: "Joaillier niv. 55",
    niveau: 0,
    art: "/game/UI/pages/forge/gems/gem-green-2.avif",
    pierre: "+5 % Parade",
    flavour: "Taillée pour dévier, jamais pour trancher. La garde se referme d'elle-même.",
  },
};
