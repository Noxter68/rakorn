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
      "Parcourez les offres du comptoir et celles des joueurs. Comparez les prix, inspectez les objets et choisissez le bon moment pour acheter.",
    reperes: ["COMPTOIR ET JOUEURS", "OFFRES À COMPARER", "PRIX DU MARCHÉ"],
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
      "Vous fixez votre prix, et personne ne peut vous en empêcher. La salle vous montre l'historique de l'objet, la meilleure offre du moment et ce que vous toucherez net — puis elle vous laisse aller contre le marché si vous le sentez.",
    reperes: ["PRIX LIBRE", "HISTORIQUE À L'APPUI", "AUCUN FRAIS DE MISE"],
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
    onglet: "Commandes",
    fond: "/captures/marche-commandes.avif",
    fondMobile: "/captures/marche-commandes-mobile.avif",
    surtitre: SURTITRE,
    titre: "Gagnez de l'or",
    accent: "avec le métier des autres.",
    texte:
      "La salle des Commandes rassemble les demandes ouvertes du royaume. Choisissez une pièce à fabriquer pour un autre joueur, puis suivez sa livraison et sa récompense.",
    reperes: ["OUVERTES À TOUS", "L'ARTISAN SE PAIE", "REPRISE APRÈS 30 MIN"],
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
      "Choisissez la pièce dans un catalogue de 461, la quantité, et ce que vous offrez par unité. Fournissez les matières pour payer moins, ou laissez l'artisan s'en charger : dans les deux cas, quelqu'un s'en occupe pendant que vous jouez ailleurs.",
    reperes: ["CATALOGUE DE 461", "COMMISSION LIBRE", "MATIÈRES AU CHOIX"],
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
      "Votre plastron a besoin d'une gravure que vous ne savez pas poser ? Confiez-le à un artisan qui la maîtrise. La pièce sort de votre sac, revient améliorée, et elle n'a jamais cessé de vous appartenir.",
    reperes: ["LA PIÈCE RESTE À VOUS", "PAR MÉTIER", "ALLER-RETOUR"],
  },
  {
    cle: "traitements",
    onglet: "Traitements",
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
