import type { Onglet, Piece, Repere } from "./types";

/**
 * Les huit métiers, et la boucle du jeu montrée huit fois.
 *
 * Un seul décor pour les huit — celui de la page Métiers du jeu. La première
 * version en faisait défiler huit, un par métier : c'était spectaculaire et
 * illisible, parce que les quatre objets posés par-dessus devaient tenir à
 * chaque fois sur un fond différent, tantôt clair, tantôt chargé. Un décor
 * unique et assourdi, et les objets redeviennent le sujet.
 *
 * Les quatre pièces ne sont plus une chaîne de fabrication propre au métier :
 * ce sont les **quatre temps de la boucle**, les mêmes pour tout le monde —
 * récolter, fabriquer, échanger, compléter —, et chaque métier les illustre
 * avec ses propres objets. Voir `ETAPES_METIER`. Avant, les paliers portaient
 * le vocabulaire de chaque métier (« Fondu », « Distillé », « Tissé ») : joli,
 * mais on lisait huit vocabulaires et jamais la règle commune qui les relie.
 *
 * Les natures mortes du dossier `profession` servent de portrait, posé
 * au-dessus. Elles sont peintes sur fond noir : superbes en gros plan,
 * illisibles étirées sur un écran, parfaites en surimpression.
 */

/**
 * Le décor de la scène : le mur de la page Métiers du jeu.
 *
 * Pas l'illustration d'atelier, mais la pierre de la Maison de Maître —
 * `--slab-pierre` — qui est ce que la page Métiers affiche réellement sous ses
 * colonnes. Le jeu y superpose deux dégradés, et la vitrine les reprend à
 * l'identique : voir `.is-pierre` dans la feuille de style.
 *
 * Une scène peinte tenait cette place et il a fallu l'assourdir jusqu'à
 * l'éteindre pour que quatre objets s'y voient. Un mur, c'est exactement ce
 * qu'on lui demandait de devenir.
 */
export const FOND_METIERS = "/game/house-master/background/background-master-house.avif";

/**
 * Les quatre temps, énoncés une fois pour les huit métiers.
 *
 * C'est le seul endroit de la page où l'on explique comment on joue, et ça se
 * lit en quatre mots posés sous quatre objets. Une section de texte aurait dit
 * la même chose et personne ne l'aurait lue.
 */
export const ETAPES_METIER = [
  { numero: "01", titre: "Récoltez la matière" },
  { numero: "02", titre: "Craftez la recette" },
  { numero: "03", titre: "Vendez ou commandez" },
  { numero: "04", titre: "Complétez l'ensemble" },
] as const;

/**
 * Ce que les huit métiers pèsent ensemble, sous le texte de droite.
 *
 * Les mêmes quatre chiffres sur les huit onglets : ils ne décrivent pas le
 * métier affiché mais le système auquel il appartient, et c'est justement ce
 * qu'on veut lire en sortant de la scène. Les emblèmes sont ceux de la barre
 * du jeu — l'enclume des Métiers, le codex des recettes, la criée du marché.
 */
export const CHIFFRES_METIERS: Repere[] = [
  { art: "/game/UI/navigation/forge.avif", valeur: "8", quoi: "métiers" },
  { art: "/game/UI/icons/xp.avif", valeur: "60", quoi: "niveaux chacun" },
  { art: "/game/UI/navigation/codex.avif", valeur: "313", quoi: "recettes" },
  { art: "/game/UI/market/auction.avif", valeur: "Économie", quoi: "de joueurs" },
];

/** L'emblème du marché : le maillet de la criée, celui de la salle des ventes. */
const MARCHE = "/game/UI/market/auction.avif";

/**
 * Un voisin dans l'économie, et ce qu'il fait de ce métier.
 *
 * **Ces liens ne sont pas décoratifs : ils sont dans les recettes.** Le
 * forgeron trempe dans l'huile de l'alchimiste, le mineur monte des gemmes que
 * le joaillier a taillées, le logisticien bâche ses caisses de la toile du
 * couturier — voir `prisma/seed/recipes`, où chaque atelier consomme ce que
 * deux ou trois autres produisent. Inventer ces flèches aurait donné un joli
 * schéma qu'aucune partie ne confirmerait ; les relever rend la scène vraie.
 *
 * Quatre voisins par métier, et leur ordre décide de leur place autour du
 * cercle : haut-gauche, bas-gauche, haut-droite, bas-droite. La gauche est ce
 * qui lui arrive, la droite ce qui en repart, et le marché tient toujours le
 * bas-gauche — c'est la constante du monde, pas une relation de métier.
 */
export interface Lien {
  art: string;
  nom: string;
  /** Ce qu'il fait de sa production, en deux ou trois mots. */
  role: string;
}

export interface Metier extends Onglet {
  /** La nature morte du métier, posée en grand, au centre du cercle. */
  portrait: string;
  /**
   * Les trois lignes sous le nom, au pied du cercle — son socle.
   *
   * Ce sont les repères qui vivaient en bas de scène. Ils y étaient une ligne
   * de mots gris sous un paragraphe ; sous le nom du métier, dans le cercle,
   * ils deviennent sa fiche d'identité et se lisent enfin.
   */
  socle: string[];
  /** Les quatre voisins, dans l'ordre où ils se posent autour du cercle. */
  liens: Lien[];
  /** Quatre pièces : la matière, la transformation, la pièce, l'exception. */
  chaine: Piece[];
  /**
   * La clé de la fiche montrée au survol de la pièce d'exception — voir
   * `fiches.ts`.
   *
   * C'est la seule chose de la vitrine qui répond à « et qu'est-ce que ça
   * donne, concrètement ». Une pièce légendaire porte une statistique
   * principale, quatre secondaires, des gemmes, leur harmonie et quatre
   * paliers d'ensemble : aucun texte ne rend cela, la fiche le rend en entier.
   */
  fiche: string;
}

export const METIERS: Metier[] = [
  {
    cle: "mineur",
    fiche: "couronne_du_roi_sous_la_montagne",
    onglet: "Mineur",
    fond: FOND_METIERS,
    portrait: "/game/profession/minage-work.avif",
    liens: [
      { art: "/game/profession/joallier-work.avif", nom: "Joaillier", role: "taille ses gemmes" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/forge-work.avif", nom: "Forgeron", role: "forge ses lingots" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "convoie le minerai" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Tout ce qui se forge",
    accent: "commence par vous.",
    texte:
      "Cent onze filons vous attendent, du banc de pierre au gisement d'obsidienne. Fondez ce que vous en tirez, vendez-le au forgeron qui l'attend : votre lingot devient son épée, et son épée vous rapporte. Sept autres métiers ont besoin du vôtre.",
    chiffres: CHIFFRES_METIERS,
    socle: ["111 FILONS", "22 LINGOTS", "NIVEAU 60"],
    chaine: [
      { art: "/game/ressources/mining/veins/filon-de-fer.avif", nom: "Filon de fer", palier: "Extrait" },
      { art: "/game/ressources/mining/lingo/lingo-de-fer.avif", nom: "Lingot de fer", palier: "Fondu" },
      { art: "/game/ressources/mining/craft/casque-de-mineur.avif", nom: "Casque de mineur", palier: "Fabriqué" },
      {
        art: "/game/ressources/mining/craft/couronne-du-roi-sous-la-montagne.avif",
        nom: "Couronne du Roi sous la Montagne",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "bucheron",
    fiche: "totem_de_la_foret_eternelle",
    onglet: "Bûcheron",
    fond: FOND_METIERS,
    portrait: "/game/profession/wood-work.avif",
    liens: [
      { art: "/game/profession/forge-work.avif", nom: "Forgeron", role: "livre l'acier des lames" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/engineer-work.avif", nom: "Ingénieur", role: "monte ses planches" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "caisse ses convois" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Quinze essences,",
    accent: "et tout le reste tient debout.",
    texte:
      "Du pin des lisières au bois-fer des forêts profondes. Vos planches deviennent des arcs, des pavois, des caisses de convoi : il n'y a pas un chantier du royaume qui se passe de vous, et vous fixez votre prix.",
    chiffres: CHIFFRES_METIERS,
    socle: ["15 ESSENCES", "12 PLANCHES", "NIVEAU 60"],
    chaine: [
      { art: "/game/ressources/wood/chene.avif", nom: "Chêne", palier: "Abattu" },
      { art: "/game/ressources/wood/planche-chene.avif", nom: "Planche de chêne", palier: "Refendue" },
      { art: "/game/ressources/wood/arc-de-chasse.avif", nom: "Arc de chasse", palier: "Fabriqué" },
      {
        art: "/game/ressources/wood/totem_de_la_foret_eternelle.avif",
        nom: "Totem de la forêt éternelle",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "forgeron",
    fiche: "epee_du_magma_eternel",
    onglet: "Forgeron",
    fond: FOND_METIERS,
    portrait: "/game/profession/forge-work.avif",
    liens: [
      { art: "/game/profession/minage-work.avif", nom: "Mineur", role: "fournit le minerai" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/joallier-work.avif", nom: "Joaillier", role: "sertit" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "transporte" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Ce que vous forgez,",
    accent: "d'autres le porteront.",
    texte:
      "Du plastron de mailles à la panoplie de douze pièces. Votre acier part au combat sur les épaules d'un autre, garde les châsses qu'un joaillier viendra remplir, et revient chez vous quand il faut le réparer. Le métier le plus demandé du royaume.",
    chiffres: CHIFFRES_METIERS,
    socle: ["ARMES & ARMURES", "PANOPLIES DE 12", "CHÂSSES À SERTIR"],
    chaine: [
      { art: "/game/ressources/forge/cendre-de-forge.avif", nom: "Cendre de forge", palier: "Récupérée" },
      { art: "/game/ressources/forge/lingot-de-machefer.avif", nom: "Lingot de mâchefer", palier: "Coulé" },
      { art: "/game/ressources/forge/epee-du-mercenaire.avif", nom: "Épée du mercenaire", palier: "Forgée" },
      {
        art: "/game/ressources/forge/epee_du_magma_eternel.avif",
        nom: "Épée du magma éternel",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "couturier",
    fiche: "manteau_du_tisseur_d_etoiles",
    onglet: "Couturier",
    fond: FOND_METIERS,
    portrait: "/game/profession/couture-work.avif",
    liens: [
      { art: "/game/profession/wood-work.avif", nom: "Bûcheron", role: "refend les planches" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/forge-work.avif", nom: "Forgeron", role: "matelasse ses armures" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "bâche ses caisses" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Plus de place au sac,",
    accent: "plus de chemin dans la journée.",
    texte:
      "Capes, sacoches et bottes légères. Vous décidez de ce que les autres peuvent rapporter d'une expédition et de la vitesse à laquelle ils rentrent — deux choses dont personne ne se passe, et qu'on rachète à chaque palier.",
    chiffres: CHIFFRES_METIERS,
    socle: ["CAPES & SACOCHES", "CUIRS LÉGERS", "EMPLACEMENTS DE SAC"],
    chaine: [
      { art: "/game/ressources/suing/laine-brut.avif", nom: "Laine brute", palier: "Récoltée" },
      { art: "/game/ressources/suing/toile-de-laine-cadree.avif", nom: "Toile de laine cardée", palier: "Tissée" },
      { art: "/game/ressources/suing/cape-doublee.avif", nom: "Cape doublée", palier: "Cousue" },
      {
        art: "/game/ressources/suing/manteau-du-tisseur-etoile.avif",
        nom: "Manteau du tisseur d'étoiles",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "joaillier",
    fiche: "parure_de_l_etoile_du_matin",
    onglet: "Joaillier",
    fond: FOND_METIERS,
    portrait: "/game/profession/joallier-work.avif",
    liens: [
      { art: "/game/profession/minage-work.avif", nom: "Mineur", role: "ouvre les filons" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/forge-work.avif", nom: "Forgeron", role: "perce les châsses" },
      { art: "/game/profession/alchimist-work.avif", nom: "Alchimiste", role: "fond ses diamants" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Vos pierres finissent",
    accent: "sur l'équipement de tous.",
    texte:
      "Seize gemmes à extraire, cinq rangs de taille, et toutes les châsses du royaume à remplir. Trois pierres de même couleur sur une pièce accordent leur harmonie et ajoutent leur prime : c'est vous qui décidez de la couleur d'un personnage.",
    chiffres: CHIFFRES_METIERS,
    socle: ["16 GEMMES", "5 NIVEAUX DE TAILLE", "HARMONIE DE COULEUR"],
    chaine: [
      { art: "/game/ressources/jewelery/filon/filon-de-rubis-brut.avif", nom: "Filon de rubis", palier: "Brut" },
      { art: "/game/ressources/jewelery/craft/gemme-taillee.avif", nom: "Gemme taillée", palier: "Taillée" },
      { art: "/game/ressources/jewelery/craft/anneau-serti.avif", nom: "Anneau serti", palier: "Serti" },
      {
        art: "/game/ressources/jewelery/craft/parrure-de-etoile-du-matin.avif",
        nom: "Parure de l'étoile du matin",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "alchimiste",
    fiche: "elixir_de_regeneration_ancienne",
    onglet: "Alchimiste",
    fond: FOND_METIERS,
    portrait: "/game/profession/alchimist-work.avif",
    liens: [
      { art: "/game/profession/joallier-work.avif", nom: "Joaillier", role: "taille ses pierres" },
      { art: MARCHE, nom: "Marché", role: "écoule les fioles" },
      { art: "/game/profession/forge-work.avif", nom: "Forgeron", role: "trempe à son huile" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "livre les caisses" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Le seul métier",
    accent: "dont la clientèle revient.",
    texte:
      "Plantes, mousses et rosées deviennent extraits ; les extraits deviennent potions. Ce que vous vendez se boit et disparaît : vos clients reviennent avant le prochain boss, et ils reviendront toujours.",
    chiffres: CHIFFRES_METIERS,
    socle: ["PLANTES & ROSÉES", "EXTRAITS", "POTIONS & ÉLIXIRS"],
    chaine: [
      { art: "/game/ressources/alchimist/racine-rouge.avif", nom: "Racine rouge", palier: "Cueillie" },
      { art: "/game/ressources/alchimist/extrait-de-valeriane.avif", nom: "Extrait de valériane", palier: "Distillé" },
      { art: "/game/ressources/alchimist/potion-de-soin-majeure.avif", nom: "Potion de soin majeure", palier: "Brassée" },
      {
        art: "/game/ressources/alchimist/elixir-de-regeneration-ancienne.avif",
        nom: "Élixir de régénération ancienne",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "ingenieur",
    fiche: "coeur_d_architecte_runique",
    onglet: "Ingénieur",
    fond: FOND_METIERS,
    portrait: "/game/profession/engineer-work.avif",
    liens: [
      { art: "/game/profession/wood-work.avif", nom: "Bûcheron", role: "fournit les planches" },
      { art: MARCHE, nom: "Marché", role: "fixe la valeur" },
      { art: "/game/profession/joallier-work.avif", nom: "Joaillier", role: "taille ses lentilles" },
      { art: "/game/profession/logistician-work.avif", nom: "Logisticien", role: "monte ses pièces" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Repoussez la limite",
    accent: "que tout le monde subit.",
    texte:
      "Engrenages, noyaux, lentilles. Vous relevez des pièces usées et vous en faites des mécanismes de précision — dont les sacs. Chaque emplacement que vous ajoutez, c'est une récolte de plus pour celui qui l'achète.",
    chiffres: CHIFFRES_METIERS,
    socle: ["PIÈCES DE PRÉCISION", "REMISE EN ÉTAT", "SACS ÉTENDUS"],
    chaine: [
      { art: "/game/ressources/enginering/engrenage-use.avif", nom: "Engrenage usé", palier: "Récupéré" },
      { art: "/game/ressources/enginering/engrenage-calibre.avif", nom: "Engrenage calibré", palier: "Rectifié" },
      { art: "/game/ressources/enginering/boussole-runique.avif", nom: "Boussole runique", palier: "Assemblée" },
      {
        art: "/game/ressources/enginering/coeur-architecte-runique.avif",
        nom: "Cœur d'architecte runique",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "logisticien",
    fiche: "sceau_des_routes_franches",
    onglet: "Logisticien",
    fond: FOND_METIERS,
    portrait: "/game/profession/logistician-work.avif",
    liens: [
      { art: "/game/profession/minage-work.avif", nom: "Mineur", role: "confie son minerai" },
      { art: MARCHE, nom: "Marché", role: "ouvre les routes" },
      { art: "/game/profession/engineer-work.avif", nom: "Ingénieur", role: "scelle ses bordereaux" },
      { art: "/game/profession/couture-work.avif", nom: "Couturier", role: "timbre ses ballots" },
    ],
    surtitre: "02 — Les métiers",
    titre: "Faites circuler",
    accent: "ce que les autres produisent.",
    texte:
      "Caravanes, convois et sceaux de route. Vous achetez où c'est abondant, vous vendez où c'est rare, et la marge est à vous. Le seul métier qui gagne sur la géographie plutôt que sur l'établi.",
    chiffres: CHIFFRES_METIERS,
    socle: ["CARAVANES", "CONVOIS ESCORTÉS", "SCEAUX DE ROUTE"],
    chaine: [
      { art: "/game/ressources/logistician/cordage-tresse.avif", nom: "Cordage tressé", palier: "Tressé" },
      { art: "/game/ressources/logistician/caisse-de-transport.avif", nom: "Caisse de transport", palier: "Assemblée" },
      { art: "/game/ressources/logistician/caravane-legere.avif", nom: "Caravane légère", palier: "Attelée" },
      {
        art: "/game/ressources/logistician/sceau-des-routes-franches.avif",
        nom: "Sceau des routes franches",
        palier: "Légendaire",
      },
    ],
  },
];
