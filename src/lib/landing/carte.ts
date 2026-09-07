import type { Onglet } from "./types";

/**
 * La carte interactive, et les trois choses qui s'y passent.
 *
 * ── Pourquoi une section à part ───────────────────────────────────────────
 *
 * La campagne raconte un chemin qu'on gravit, les métiers racontent ce qu'on
 * fabrique. La carte ne raconte ni l'un ni l'autre : c'est le seul écran du jeu
 * qui **change tout seul**, pour tout le monde, sans qu'on ait rien fait — les
 * filons se replacent, un placard tombe, un coffre s'enfouit ailleurs. C'est
 * aussi le seul endroit où l'on travaille avec des gens qu'on ne rencontrera
 * jamais.
 *
 * ── Quatre onglets, quatre horloges ───────────────────────────────────────
 *
 * Chacun porte son rythme, et c'est l'information qui compte : un visiteur veut
 * savoir à quelle fréquence le jeu lui redonne une raison de revenir. Les
 * chiffres annoncés sont ceux du code — voir `packages/shared/src/avis.ts`,
 * `reconstructions.ts` et `tresors.ts` —, pas des ordres de grandeur choisis
 * pour la vitrine.
 */

/** Ce qu'une activité de la carte porte en propre : son emblème et son pas. */
export interface VoletCarte extends Onglet {
  /** La vignette du losange, telle qu'elle se pose sur la carte du jeu. */
  embleme: string;
  /** La couleur du sertissage, relevée dans la vignette. */
  teinte: string;
  /** Tous les combien ça change. */
  horloge: string;
  /** Les trois ou quatre choses à savoir, en une ligne chacune. */
  points: string[];
}

export const VOLETS_CARTE: VoletCarte[] = [
  {
    cle: "atlas",
    onglet: "L'atlas",
    fond: "/game/interactive-map/map-all-zones.avif",
    embleme: "/game/interactive-map/expeditions/site-abandonnee.avif",
    teinte: "#5aa9d6",
    horloge: "Toutes les 8 h",
    surtitre: "07 — La carte interactive",
    titre: "Huit terres",
    accent: "qui vous attendent.",
    texte:
      "Parcourez la carte à la molette, ouvrez les contrées l'une après l'autre, et posez la main sur cent onze filons. Chaque terre tire son humeur du cycle : trouvez celle qui donne aujourd'hui, arrivez avant les autres, et repartez les poches pleines.",
    points: [
      "Chaque terre tire son humeur du cycle — veine généreuse, terre égale, terre close.",
      "Les filons changent de place à chaque rotation : on revient regarder au lieu de refaire le trajet de mémoire.",
      "Rien n'est planifié côté serveur — tout se déduit de l'heure, donc rien ne peut être manqué.",
    ],
    reperes: ["8 TERRES", "111 FILONS", "RÉSERVE COMMUNE"],
  },
  {
    cle: "avis",
    onglet: "Avis de recherche",
    fond: "/game/interactive-map/sylve-de-rouvre.avif",
    embleme: "/game/interactive-map/expeditions/avis-de-recherche.avif",
    teinte: "#c2402f",
    horloge: "Toutes les 2 h",
    surtitre: "07 — La carte interactive",
    titre: "Dix têtes",
    accent: "mises à prix pour vous.",
    texte:
      "Le Veneur sans Meute a perdu ses chiens et chasse à leur place ; au matin, il manque une bête au troupeau. La Couronne placarde sa tête, et celle de neuf autres. Chaque avis est taillé à votre niveau, et le tableau change toutes les deux heures.",
    points: [
      "Trois placards à la fois, jamais à plus de quatre niveaux de vous.",
      "Le placard lève le verrou de niveau dans sa terre : on peut aller chercher une bête qu'on n'aurait pas encore croisée.",
      "La prime remplace le butin en or de la bête — elle change ce qu'on va combattre, pas ce que ça rapporte.",
    ],
    reperes: ["10 AVIS", "±4 NIVEAUX", "1 PAR CYCLE"],
  },
  {
    cle: "chantiers",
    onglet: "Chantiers du royaume",
    fond: "/game/interactive-map/gorges-de-fendeval.avif",
    embleme: "/game/interactive-map/expeditions/reconstructions.avif",
    teinte: "#d9862f",
    horloge: "Toutes les 4 h",
    surtitre: "07 — La carte interactive",
    titre: "Un pont",
    accent: "que vous relèverez ensemble.",
    texte:
      "La crue a pris la pile centrale, et Fendeval est redevenu deux pays. Dix ouvrages du royaume attendent leurs matériaux — une palissade, un moulin, un convoi, une porte. Versez ce que vous voulez, quand vous voulez : le jour où l'ouvrage tient debout, tout le monde est payé, et vous d'autant plus que vous avez porté.",
    points: [
      "La part se compte en valeur de ce qu'on a porté, jamais en nombre d'unités.",
      "L'or se partage au prorata ; le Renom et le Sceau Céleste sont entiers pour chacun.",
      "Rien n'est versé tant que l'ouvrage n'est pas debout — et il ne se boucle pas en une soirée.",
    ],
    reperes: ["10 OUVRAGES", "500+ UNITÉS", "PART AU PRORATA"],
  },
  {
    cle: "coffres",
    onglet: "Coffres",
    fond: "/game/interactive-map/mine-d-argent.avif",
    embleme: "/game/interactive-map/expeditions/tresor.avif",
    teinte: "#2fbfa0",
    horloge: "Toutes les 12 h",
    surtitre: "07 — La carte interactive",
    titre: "Trois coffres,",
    accent: "et personne ne sait où.",
    texte:
      "Quelqu'un a enfoui ça là et n'est jamais revenu le reprendre. Quinze points d'énergie pour soulever le couvercle : de l'or sept fois sur dix, une matière rare une fois sur trois, une seconde une fois sur sept. Trois coffres dorment sur la carte, et ils changent de place deux fois par jour.",
    points: [
      "Ce qu'on y trouve est rare, épique ou légendaire, et toujours à hauteur de votre métier.",
      "Une à trois unités, jamais davantage : c'est une trouvaille, pas un approvisionnement.",
      "Un coffre peut être vide. C'est ce risque-là qui vaut les quinze points d'énergie.",
    ],
    reperes: ["3 COFFRES", "70 % D'OR", "35 % UNE PIÈCE"],
  },
];
