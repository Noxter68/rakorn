import type { Onglet } from "./types";

/**
 * Le marché, montré tel qu'il est à l'écran.
 *
 * La première version reconstituait un tableau de prix en HTML. C'était une
 * imitation : plus pauvre que la vraie salle, et surtout menteuse, puisqu'un
 * visiteur n'aurait jamais retrouvé cet écran-là en jouant. Ce sont maintenant
 * des captures du jeu qui tourne, prises par `scripts/capture-marche.mjs`.
 *
 * L'avantage n'est pas seulement esthétique : une capture ne peut pas
 * diverger du produit sans qu'on le voie. Le tableau reconstitué, lui, serait
 * resté fidèle à la version de la salle qui existait le jour où on l'a écrit,
 * et personne ne s'en serait aperçu.
 *
 * Les images ne sont pas synchronisées depuis `apps/web/public` : elles n'y
 * existent pas, elles sont produites ici. Elles vivent donc dans
 * `public/captures/`, qui est dans git, contrairement à `public/game/`.
 */
/**
 * Une salle est un onglet, et sa capture *est* son décor.
 *
 * Elle flottait d'abord en panneau au milieu de la scène, sur une illustration
 * d'étals. Deux images l'une sur l'autre, dont une seule comptait : la capture
 * prend maintenant l'écran entier, et le titre, les onglets et le texte se
 * posent dessus comme sur toutes les autres scènes. C'est aussi la seule
 * manière de la montrer assez grande pour qu'on y lise quelque chose.
 */
export type Salle = Onglet;
const SURTITRE = "03 — Le marché et les commandes";

export const SALLES_MARCHE: Salle[] = [
  {
    cle: "acheter",
    onglet: "Acheter",
    fond: "/captures/marche-acheter.avif",
    fondMobile: "/captures/marche-acheter-mobile.avif",
    surtitre: SURTITRE,
    titre: "Tout a un prix.",
    accent: "À vous de choisir.",
    texte:
      "Parcourez les offres du comptoir et celles des joueurs, et comparez-les au prix du marché : il suit les vraies ventes entre joueurs, à la hausse comme à la baisse, et un « i » vous dit d'où il vient. La courbe des sept derniers jours dit le reste.",
    reperes: ["COMPTOIR ET JOUEURS", "PRIX DES VENTES RÉELLES", "SEPT JOURS D'HISTORIQUE"],
  },
  {
    cle: "vendre",
    onglet: "Vendre",
    fond: "/captures/marche-vendre.avif",
    fondMobile: "/captures/marche-vendre-mobile.avif",
    surtitre: SURTITRE,
    titre: "Votre prix,",
    accent: "votre décision.",
    texte:
      "Vous fixez votre prix. La salle vous montre l'historique de l'objet, la meilleure offre du moment et le prix proposé — puis elle vous laisse aller contre le marché si vous le sentez, jusqu'au double de la référence. Mettre en vente ne coûte rien.",
    reperes: ["VOTRE PRIX", "HISTORIQUE À L'APPUI", "AUCUN FRAIS DE MISE"],
  },
  {
    cle: "mes-ventes",
    onglet: "Mes ventes",
    fond: "/captures/marche-mes-ventes.avif",
    fondMobile: "/captures/marche-mes-ventes-mobile.avif",
    surtitre: SURTITRE,
    titre: "Ajustez vos prix",
    accent: "sans rien retirer.",
    texte:
      "Retrouvez vos offres en cours, leur prix, leur position sur le marché et les ventes récentes. Ajustez votre tarif ou retirez une pièce directement depuis cette salle.",
    reperes: ["OFFRES ACTIVES", "RÉVISION DU PRIX", "SUIVI DES VENTES"],
  },
  {
    cle: "commandes",
    onglet: "Ouvertes",
    fond: "/captures/marche-commandes.avif",
    fondMobile: "/captures/marche-commandes-mobile.avif",
    surtitre: SURTITRE,
    titre: "Gagnez de l'or",
    accent: "avec le métier des autres.",
    texte:
      "La salle des Commandes rassemble les demandes du royaume, matières fournies. Une commande s'ouvre d'abord aux artisans de votre niveau, puis monte d'une bande toutes les dix minutes : ceux qui débutent ont leur part avant que le sommet ne rafle tout.",
    reperes: ["PAR BANDE DE NIVEAU", "L'ARTISAN SE PAIE", "À TOUS APRÈS 30 MIN"],
  },
  {
    cle: "creer",
    onglet: "Créer",
    fond: "/captures/marche-creer.avif",
    fondMobile: "/captures/marche-creer-mobile.avif",
    surtitre: SURTITRE,
    titre: "Faites faire",
    accent: "ce que vous ne savez pas faire.",
    texte:
      "Choisissez la pièce dans un catalogue de 495 recettes, la quantité, l'œuvre minimale et ce que vous offrez par unité. Vous fournissez les matières, l'artisan son savoir-faire — et si c'est pressé, une commande urgente s'ouvre à tous d'un coup, pour un quart de commission en plus.",
    reperes: ["CATALOGUE DE 495", "COMMISSION LIBRE", "COMMANDE URGENTE"],
  },
  {
    cle: "confier",
    onglet: "Confier",
    fond: "/captures/marche-confier.avif",
    fondMobile: "/captures/marche-confier-mobile.avif",
    surtitre: SURTITRE,
    titre: "Confiez votre pièce.",
    accent: "Elle vous revient meilleure.",
    texte:
      "Votre plastron a besoin d'une gravure que vous ne savez pas poser ? Confiez-le à un artisan qui la maîtrise. La pièce sort de votre sac, revient améliorée, et elle n'a jamais cessé de vous appartenir. Il faut qu'elle en vaille la peine : rare au moins, et de niveau 50.",
    reperes: ["LA PIÈCE RESTE À VOUS", "DÈS LE NIVEAU 50", "ALLER-RETOUR"],
  },
  {
    cle: "traitements",
    onglet: "Mes traitements",
    fond: "/captures/marche-traitements.avif",
    fondMobile: "/captures/marche-traitements-mobile.avif",
    surtitre: SURTITRE,
    titre: "Poussez une pièce",
    accent: "au-delà de la forge.",
    texte:
      "Trempe volcanique, gravure draconique, cémentation abyssale. Déposez votre pièce, choisissez le traitement, et un Maître qui l'a cherché aux Archives le pose. C'est irréversible — et c'est ce qui sépare un bon équipement du vôtre.",
    reperes: ["PAR LES MAÎTRES", "UN À LA FOIS", "IRRÉVERSIBLE"],
  },
];
