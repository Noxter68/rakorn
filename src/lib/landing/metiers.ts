import type { Onglet, Piece, Repere } from "./types";

/**
 * Les huit métiers, le Maître-queux en annexe, et la boucle du jeu montrée
 * neuf fois.
 *
 * Le Maître-queux n'est pas un neuvième métier : il ne se choisit pas à la
 * naissance, ne prend la place d'aucun autre, et tout héros l'apprend dès le
 * niveau 10 (`METIERS_ANNEXES`, proclamation « Le Maître-queux passe à
 * table »). Les chiffres disent donc toujours huit métiers ; l'onglet, lui,
 * le montre, parce que c'est le seul dont tout le monde se sert.
 *
 * **La scène ne montre plus que la boucle.** Elle portait aussi un réseau —
 * le métier au centre d'un cercle, quatre voisins reliés par des fils — et ce
 * réseau, joli, disait une seconde chose au moment où l'on n'en avait compris
 * aucune. Il ne reste que les quatre marches, en grand et au centre, et la
 * fiche de la dernière à droite : c'est tout ce qu'un visiteur doit emporter.
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
  "Récoltez la matière",
  "Craftez la recette",
  "Vendez ou commandez",
] as const;

/**
 * La quatrième marche, qui dépend du métier.
 *
 * Seuls cinq métiers fabriquent des pièces des ensembles permanents —
 * mineur, bûcheron, forgeron, couturier, joaillier, relevés dans les recettes
 * dont la pièce appartient à un `ItemSet`. (Le Harnois des Âges Oubliés, un
 * événement, en confie aussi à l'ingénieur et à l'alchimiste ; il passe.)
 * Écrire « Complétez l'ensemble » sous un nectar ou une charte promettait une
 * panoplie que ces métiers ne fabriquent pas. Les trois autres visent leur
 * pièce légendaire — une vraie, relevée en base.
 */
export const FINALES = {
  ensemble: "Complétez l'ensemble",
  legendaire: "Visez le légendaire",
  /* Le Maître-queux ne fait ni ensemble ni légendaire : son sommet est la
     tablée, un grand plat de cinq parts qu'on partage avant l'Ossuaire ou une
     expédition. */
  tablee: "Dressez la tablée",
} as const;

/** Les quatre marches d'un métier, dans l'ordre où elles se lisent. */
export function etapesDe(metier: Metier): string[] {
  const [premiere, ...suite] = ETAPES_METIER;
  return [metier.premiere ?? premiere, ...suite, FINALES[metier.finale]];
}

/**
 * Ce que les huit métiers pèsent ensemble, sous le texte de droite.
 *
 * Les mêmes quatre chiffres sur les huit onglets : ils ne décrivent pas le
 * métier affiché mais le système auquel il appartient, et c'est justement ce
 * qu'on veut lire en sortant de la scène. Les emblèmes sont ceux de la barre
 * du jeu — l'enclume des Métiers, le codex des recettes, la criée du marché.
 */
export const CHIFFRES_METIERS: Repere[] = [
  { art: "/game/UI/navigation-v4/metiers.avif", valeur: "8", quoi: "métiers" },
  { art: "/game/UI/pages/inventaire/sections/experience-v2.avif", valeur: "60", quoi: "niveaux chacun" },
  { art: "/game/UI/navigation-v4/codex.avif", valeur: "495", quoi: "recettes" },
  { art: "/game/UI/pages/inventaire/sections/divers-v2.avif", valeur: "Économie", quoi: "de joueurs" },
];

export interface Metier extends Onglet {
  /** Quatre pièces : la matière, la transformation, la pièce, la dernière marche. */
  chaine: Piece[];
  /** Ce que vise la quatrième marche — voir `FINALES`. */
  finale: keyof typeof FINALES;
  /**
   * La clé de la fiche de la dernière marche — voir `fiches.ts`.
   *
   * C'est la seule chose de la vitrine qui répond à « et qu'est-ce que ça
   * donne, concrètement ». Une pièce légendaire porte une statistique
   * principale, quatre secondaires, des gemmes, leur harmonie et quatre
   * paliers d'ensemble : aucun texte ne rend cela, la fiche le rend en entier.
   */
  fiche: string;
  /**
   * La première marche, quand « Récoltez la matière » serait faux : le
   * logisticien ne récolte rien (« Ne récolte rien : il transforme », dit le
   * jeu), il achète la sienne.
   */
  premiere?: string;
}

export const METIERS: Metier[] = [
  {
    cle: "mineur",
    fiche: "couronne_du_roi_sous_la_montagne",
    finale: "ensemble",
    onglet: "Mineur",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Tout ce qui se forge",
    accent: "commence par vous.",
    texte:
      "Seize filons, de la pierre au mithril, qui se récoltent depuis la fenêtre des Métiers pendant que vous jouez ailleurs. Fondez ce que vous en tirez, vendez-le au forgeron qui l'attend : votre lingot devient son épée, et son épée vous rapporte. Sept autres métiers ont besoin du vôtre.",
    chiffres: CHIFFRES_METIERS,
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
    fiche: "arc_des_sylves_eternelles",
    finale: "ensemble",
    onglet: "Bûcheron",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Quinze essences,",
    accent: "et tout le reste tient debout.",
    texte:
      "Du pin des lisières au bois-fer des forêts profondes. Vos planches deviennent des arcs, des pavois, des caisses de convoi : il n'y a pas un chantier du royaume qui se passe de vous, et ce sont vos ventes qui font le prix du bois.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/wood/chene.avif", nom: "Chêne", palier: "Abattu" },
      { art: "/game/ressources/wood/planche-chene.avif", nom: "Planche de chêne", palier: "Refendue" },
      { art: "/game/ressources/wood/arc-de-chasse.avif", nom: "Arc de chasse", palier: "Fabriqué" },
      {
        art: "/game/ressources/armors/set-sylves_eternelles/arc_des_sylves_eternelles.avif",
        nom: "Arc des Sylves Éternelles",
        palier: "Ensemble",
      },
    ],
  },
  {
    cle: "forgeron",
    fiche: "masse_du_roi_sous_la_montagne",
    finale: "ensemble",
    onglet: "Forgeron",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Ce que vous forgez,",
    accent: "d'autres le porteront.",
    texte:
      "Du plastron de mailles à la panoplie de douze pièces. Votre acier part au combat sur les épaules d'un autre, et garde les châsses qu'un joaillier viendra remplir. Votre maîtrise décide de chaque exemplaire : honnête, royal, ou chef-d'œuvre — et un chef-d'œuvre se vend jusqu'au double.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/forge/cendre-de-forge.avif", nom: "Cendre de forge", palier: "Récupérée" },
      { art: "/game/ressources/forge/lingot-de-machefer.avif", nom: "Lingot de mâchefer", palier: "Coulé" },
      { art: "/game/ressources/forge/epee-du-mercenaire.avif", nom: "Épée du mercenaire", palier: "Forgée" },
      {
        art: "/game/ressources/armors/set-roi_sous_la_montagne/masse_du_roi_sous_la_montagne.avif",
        nom: "Masse du Roi sous la Montagne",
        palier: "Ensemble",
      },
    ],
  },
  {
    cle: "couturier",
    fiche: "cape_du_roi_sous_la_montagne",
    finale: "ensemble",
    onglet: "Couturier",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Plus de place au sac,",
    accent: "plus de butin au retour.",
    texte:
      "Capes, sacoches et bottes légères. Les plus grands sacs du royaume sortent de votre atelier, jusqu'à trente places : vous décidez de ce que les autres peuvent rapporter, et c'est une chose dont personne ne se passe, qu'on rachète à chaque palier.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/suing/laine-brut.avif", nom: "Laine brute", palier: "Récoltée" },
      { art: "/game/ressources/suing/toile-de-laine-cadree.avif", nom: "Toile de laine cardée", palier: "Tissée" },
      { art: "/game/ressources/suing/cape-doublee.avif", nom: "Cape doublée", palier: "Cousue" },
      {
        art: "/game/ressources/armors/set-roi_sous_la_montagne/cape_du_roi_sous_la_montagne.avif",
        nom: "Cape du Roi sous la Montagne",
        palier: "Ensemble",
      },
    ],
  },
  {
    cle: "joaillier",
    fiche: "anneau_du_roi_sous_la_montagne",
    finale: "ensemble",
    onglet: "Joaillier",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Vos pierres finissent",
    accent: "sur l'équipement de tous.",
    texte:
      "Seize filons à extraire, six couleurs de gemmes, cinq rangs de taille, et les châsses des grandes pièces à remplir. Une pièce dont toutes les pierres sont de la même couleur s'accorde et ajoute sa prime : c'est vous qui décidez de la couleur d'un personnage.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/jewelery/filon/filon-de-rubis-brut.avif", nom: "Filon de rubis", palier: "Brut" },
      { art: "/game/ressources/jewelery/craft/gemme-taillee.avif", nom: "Gemme taillée", palier: "Taillée" },
      { art: "/game/ressources/jewelery/craft/anneau-serti.avif", nom: "Anneau serti", palier: "Serti" },
      {
        art: "/game/ressources/armors/set-roi_sous_la_montagne/anneau_du_roi_sous_la_montagne.avif",
        nom: "Anneau du Roi sous la Montagne",
        palier: "Ensemble",
      },
    ],
  },
  {
    cle: "alchimiste",
    fiche: "nectar_de_l_arbre_du_monde",
    finale: "legendaire",
    onglet: "Alchimiste",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Ce que vous vendez",
    accent: "se boit avant chaque boss.",
    texte:
      "Plantes, mousses et rosées deviennent extraits ; les extraits deviennent potions. Ce que vous vendez se boit et disparaît : vos clients reviennent avant le prochain boss, et ils reviendront toujours. Au sommet, le Nectar de l'Arbre-Monde, que même les écuries de la cité de guilde réclament.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/alchimist/racine-rouge.avif", nom: "Racine rouge", palier: "Cueillie" },
      { art: "/game/ressources/alchimist/extrait-de-valeriane.avif", nom: "Extrait de valériane", palier: "Distillé" },
      { art: "/game/ressources/alchimist/potion-de-soin-majeure.avif", nom: "Potion de soin majeure", palier: "Brassée" },
      {
        art: "/game/ressources/alchimist/nectar-de-arbre-monde.avif",
        nom: "Nectar de l'Arbre-Monde",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "ingenieur",
    fiche: "coeur_d_architecte_runique",
    finale: "legendaire",
    onglet: "Ingénieur",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Repoussez la limite",
    accent: "que tout le monde subit.",
    texte:
      "Engrenages, noyaux, lentilles. Vous relevez des pièces usées et vous en faites des mécanismes de précision : des sacs, et les trousses dont chacun se sert pour réparer son équipement à la Forge. Chaque emplacement que vous ajoutez, c'est une récolte de plus pour celui qui l'achète.",
    chiffres: CHIFFRES_METIERS,
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
    fiche: "charte_specialisation",
    finale: "legendaire",
    premiere: "Achetez la matière",
    onglet: "Logisticien",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers",
    titre: "Faites circuler",
    accent: "ce que les autres produisent.",
    texte:
      "Caravanes, convois et sceaux de route : vous ne récoltez rien, vous transformez. Vos caravanes portent les expéditions de la guilde, vos mandats de prime rendent chaque butin de l'Ossuaire plus probable, et votre Charte de spécialisation ouvre un troisième métier à qui la signe.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/logistician/cordage-tresse.avif", nom: "Cordage tressé", palier: "Tressé" },
      { art: "/game/ressources/logistician/caisse-de-transport.avif", nom: "Caisse de transport", palier: "Assemblée" },
      { art: "/game/ressources/logistician/caravane-legere.avif", nom: "Caravane légère", palier: "Attelée" },
      {
        art: "/game/ressources/logistician/charte-de-specialisation.avif",
        nom: "Charte de spécialisation",
        palier: "Légendaire",
      },
    ],
  },
  {
    cle: "maitre-queux",
    fiche: "tablee_du_trone",
    finale: "tablee",
    premiere: "Pêchez la prise",
    onglet: "Maître-queux",
    fond: FOND_METIERS,
    surtitre: "02 — Les métiers · le métier annexe",
    titre: "Une épée dure des semaines,",
    accent: "un repas, une soirée.",
    texte:
      "Le métier annexe, ouvert à tous dès le niveau 10, en plus des vôtres. Pêchez dans seize eaux du royaume, cuisinez à la marmite avec le gibier que rapportent les combattants : un héros rassasié est plus solide ou plus dangereux, de 5 à 12 %, pendant une à deux heures, dans chaque combat qu'il livre.",
    chiffres: CHIFFRES_METIERS,
    chaine: [
      { art: "/game/ressources/maitre-queux/peche/goujon-des-gues.avif", nom: "Goujon des gués", palier: "Pêché" },
      { art: "/game/ressources/maitre-queux/preparations/bouillon-clair.avif", nom: "Bouillon clair", palier: "Mijoté" },
      { art: "/game/ressources/maitre-queux/plats/soupe-de-goujons.avif", nom: "Soupe de goujons", palier: "Servie" },
      {
        art: "/game/ressources/maitre-queux/banquets/tablee-du-trone.avif",
        nom: "Tablée du Trône",
        palier: "Épique",
      },
    ],
  },
];
