import type { Onglet, Piece } from "./types";

/**
 * Ce qu'on ne bâtit pas seul.
 *
 * Deux onglets, pas quatre. Une trésorerie et des rôles n'ont pas d'image, et
 * une scène plein écran ne sait rien montrer d'un tableau de droits : le sujet
 * a sa place dans le texte, pas dans un onglet qui afficherait le même décor
 * en prétendant parler d'autre chose.
 */
export interface Volet extends Onglet {
  pieces: Piece[];
}

export const VOLETS_GUILDE: Volet[] = [
  {
    cle: "cite",
    onglet: "La cité",
    fond: "/game/UI/guild/background/cite-apercu.avif",
    surtitre: "08 — Guildes et expéditions",
    titre: "Une cité",
    accent: "que vous bâtissez ensemble.",
    texte:
      "Six bâtiments à financer en commun, et chacun rend son service à toute la guilde : l'entrepôt garde, le comptoir négocie, l'écurie raccourcit vos routes, la Tour des Contrats élargit vos commandes. Ce que vous versez profite à tout le monde, y compris à vous.",
    reperes: ["6 BÂTIMENTS", "TRÉSORERIE COMMUNE", "RÔLES ET DROITS"],
    pieces: [
      { art: "/game/UI/guild/cite/hall-de-guilde.avif", nom: "Hall de guilde", palier: "" },
      { art: "/game/UI/guild/cite/enrtepot.avif", nom: "Entrepôt", palier: "" },
      { art: "/game/UI/guild/cite/comptoir-marchand.avif", nom: "Comptoir marchand", palier: "" },
      { art: "/game/UI/guild/cite/citadelle.avif", nom: "Citadelle", palier: "" },
    ],
  },
  {
    cle: "expeditions",
    onglet: "Les expéditions",
    fond: "/game/UI/guild/background/expeditions/trone-de-braise/trone-de-braise.avif",
    surtitre: "08 — Guildes et expéditions",
    titre: "Huit sorties",
    accent: "que vous mènerez ensemble.",
    texte:
      "Chargez les caravanes, encaissez les imprévus de la route, partagez le butin au retour. La Nécropole des Rois Brisés et la Forge des Dieux Déchus se donnent à ceux qui viennent à plusieurs — et elles gardent le meilleur du jeu.",
    reperes: ["8 EXPÉDITIONS", "EN GROUPE", "BUTIN PARTAGÉ"],
    pieces: [
      { art: "/game/UI/guild/background/expeditions/caveau-de-cendre/caveau-de-cendre.avif", nom: "Caveau de Cendre", palier: "" },
      { art: "/game/UI/guild/background/expeditions/observatoir-noir/observatoir-noir.avif", nom: "Observatoire Noir", palier: "" },
      { art: "/game/UI/guild/background/expeditions/citadelle-de-l-abime/citadelle-de-l-abime.avif", nom: "Citadelle de l'Abîme", palier: "" },
      { art: "/game/UI/guild/background/expeditions/profondeur-oubliees/profondeur-oublie.avif", nom: "Profondeurs Oubliées", palier: "" },
      { art: "/game/UI/guild/background/expeditions/necropole-des-rois-brise/necopole-des-rois-brise.avif", nom: "Nécropole des Rois Brisés", palier: "" },
      { art: "/game/UI/guild/background/expeditions/forge-des-dieux-dechus/forge-des-dieux-dechu.avif", nom: "Forge des Dieux Déchus", palier: "" },
      { art: "/game/UI/guild/background/expeditions/salle-des-deux-couronnes/salle-des-deux-couronnes.avif", nom: "Salle des Deux Couronnes", palier: "" },
      { art: "/game/UI/guild/background/expeditions/trone-de-braise/trone-de-braise.avif", nom: "Trône de Braise", palier: "" },
    ],
  },
];
