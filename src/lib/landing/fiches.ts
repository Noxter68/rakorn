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
 * d'un ensemble, et les gemmes serties sur la Lame du Serment. Aucun visiteur
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

/** Les quatre paliers de l'Ensemble du Roi sous la Montagne. */
const ROI: Palier[] = [
  { pieces: 3, label: "Armure", valeur: "+65" },
  { pieces: 6, label: "Attaque", valeur: "+65" },
  { pieces: 9, label: "Parade", valeur: "+10 %" },
  { pieces: 12, label: "Vie max", valeur: "+550" },
];

/** Ceux de l'Ensemble du Serment. */
const SERMENT: Palier[] = [
  { pieces: 3, label: "Attaque", valeur: "+85" },
  { pieces: 6, label: "Armure", valeur: "+85" },
  { pieces: 9, label: "Critique", valeur: "+12 %" },
  { pieces: 12, label: "Vie max", valeur: "+750" },
];

export const FICHES: Record<string, Fiche> = {
  // ── Les pièces d'exception, une par métier ──────────────────────────────
  couronne_du_roi_sous_la_montagne: {
    nom: "Couronne du Roi sous la Montagne",
    rarete: "legendary",
    nature: "Casque",
    metier: "Mineur niv. 57",
    niveau: 57,
    art: "/game/ressources/mining/craft/couronne-du-roi-sous-la-montagne.avif",
    chasses: 2,
    principale: { stat: "defense", valeur: 24 },
    secondaires: [
      { stat: "attack", valeur: 8 },
      { stat: "parade", valeur: 3 },
      { stat: "crit", valeur: 3 },
      { stat: "hp", valeur: 32 },
    ],
    durabilite: [119, 120],
    ensemble: { nom: "Ensemble du Roi sous la Montagne", portees: 5, paliers: ROI },
  },
  totem_de_la_foret_eternelle: {
    nom: "Totem de la forêt éternelle",
    rarete: "legendary",
    nature: "Amulette",
    metier: "Bûcheron niv. 55",
    niveau: 55,
    art: "/game/ressources/wood/totem_de_la_foret_eternelle.avif",
    chasses: 2,
    principale: { stat: "attack", valeur: 18 },
    secondaires: [
      { stat: "defense", valeur: 5 },
      { stat: "crit", valeur: 8 },
      { stat: "hp", valeur: 43 },
    ],
    durabilite: [119, 120],
  },
  epee_du_magma_eternel: {
    nom: "Épée du magma éternel",
    rarete: "epic",
    nature: "Arme",
    metier: "Forgeron niv. 55",
    niveau: 55,
    art: "/game/ressources/forge/epee_du_magma_eternel.avif",
    chasses: 2,
    principale: { stat: "attack", valeur: 31 },
    secondaires: [
      { stat: "crit", valeur: 5 },
      { stat: "hp", valeur: 30 },
    ],
    durabilite: [119, 120],
  },
  manteau_du_tisseur_d_etoiles: {
    nom: "Manteau du tisseur d'étoiles",
    rarete: "legendary",
    nature: "Cape",
    metier: "Couturier niv. 55",
    niveau: 55,
    art: "/game/ressources/suing/manteau-du-tisseur-etoile.avif",
    principale: { stat: "defense", valeur: 20 },
    secondaires: [
      { stat: "parade", valeur: 6 },
      { stat: "hp", valeur: 50 },
    ],
    durabilite: [119, 120],
  },
  parure_de_l_etoile_du_matin: {
    nom: "Parure de l'étoile du matin",
    rarete: "epic",
    nature: "Amulette",
    metier: "Joaillier niv. 55",
    niveau: 55,
    art: "/game/ressources/jewelery/craft/parrure-de-etoile-du-matin.avif",
    chasses: 2,
    principale: { stat: "attack", valeur: 18 },
    secondaires: [
      { stat: "defense", valeur: 5 },
      { stat: "crit", valeur: 7 },
      { stat: "hp", valeur: 47 },
    ],
    durabilite: [119, 120],
  },
  elixir_de_regeneration_ancienne: {
    nom: "Élixir de régénération ancienne",
    rarete: "epic",
    nature: "Potion",
    metier: "Alchimiste niv. 48",
    niveau: 0,
    art: "/game/ressources/alchimist/elixir-de-regeneration-ancienne.avif",
  },
  coeur_d_architecte_runique: {
    nom: "Cœur d'architecte runique",
    rarete: "legendary",
    nature: "Cape",
    metier: "Ingénieur niv. 55",
    niveau: 55,
    art: "/game/ressources/enginering/coeur-architecte-runique.avif",
    principale: { stat: "defense", valeur: 21 },
    secondaires: [
      { stat: "parade", valeur: 7 },
      { stat: "hp", valeur: 52 },
    ],
    durabilite: [119, 120],
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

  // ── Ce qui sort de la forge ─────────────────────────────────────────────
  lingot_de_fer: {
    nom: "Lingot de fer",
    rarete: "uncommon",
    nature: "Ressource",
    metier: "Mineur niv. 3",
    niveau: 0,
    art: "/game/ressources/mining/lingo/lingo-de-fer.avif",
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
    metier: "Forgeron niv. 30",
    niveau: 30,
    art: "/game/ressources/forge/plastron_du_sentinelle.avif",
    chasses: 1,
    principale: { stat: "defense", valeur: 19 },
    secondaires: [
      { stat: "parade", valeur: 2 },
      { stat: "hp", valeur: 41 },
    ],
    durabilite: [100, 100],
  },
  bouclier_du_bastion: {
    nom: "Bouclier du bastion",
    rarete: "rare",
    nature: "Main gauche",
    metier: "Forgeron niv. 30",
    niveau: 30,
    art: "/game/ressources/forge/bouclier-du-bastion.avif",
    chasses: 1,
    principale: { stat: "defense", valeur: 18 },
    secondaires: [
      { stat: "parade", valeur: 5 },
      { stat: "hp", valeur: 15 },
    ],
    durabilite: [100, 100],
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
    principale: { stat: "defense", valeur: 28 },
    secondaires: [
      { stat: "attack", valeur: 9 },
      { stat: "parade", valeur: 5 },
      { stat: "crit", valeur: 3 },
      { stat: "hp", valeur: 40 },
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
    principale: { stat: "defense", valeur: 28 },
    secondaires: [
      { stat: "parade", valeur: 4 },
      { stat: "hp", valeur: 62 },
    ],
    durabilite: [150, 150],
    ensemble: { nom: "Ensemble du Serment", portees: 4, paliers: SERMENT },
  },
  lame_mythique: {
    nom: "Lame du Serment",
    rarete: "mythic",
    nature: "Arme",
    metier: "Forgeron niv. 60",
    niveau: 60,
    art: "/game/ressources/armors/set-mythique/lame_mythique.avif",
    chasses: 3,
    principale: { stat: "attack", valeur: 34 },
    secondaires: [
      { stat: "crit", valeur: 6 },
      { stat: "hp", valeur: 39 },
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
    principale: { stat: "defense", valeur: 36 },
    secondaires: [
      { stat: "parade", valeur: 10 },
      { stat: "hp", valeur: 22 },
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
