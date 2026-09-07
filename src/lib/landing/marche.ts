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
const SURTITRE = "03 — Le marché";

export const SALLES_MARCHE: Salle[] = [
  {
    cle: "acheter",
    onglet: "Acheter",
    fond: "/captures/marche-acheter.avif",
    surtitre: SURTITRE,
    titre: "Tout a un prix.",
    accent: "À vous de le fixer.",
    texte:
      "Aucun marchand ne décide à votre place. Tout ce que vous voyez à l'étal a été extrait, travaillé et mis en vente par des joueurs — et le prix que vous payez, c'est celui qu'ils ont osé demander. Apprenez à lire le marché, et vous achèterez toujours au bon moment.",
    reperes: ["PRIX LIBRES", "OFFRE & DEMANDE", "FRAIS DÉGRESSIFS"],
  },
  {
    cle: "vendre",
    onglet: "Vendre",
    fond: "/captures/marche-vendre.avif",
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
    surtitre: SURTITRE,
    titre: "Ajustez vos prix",
    accent: "sans rien retirer.",
    texte:
      "Dix emplacements d'étal, l'activité du marché en regard, et un prix que vous corrigez d'un clic dès qu'un concurrent passe dessous. Montez la compétence « Négociant » et le comptoir prélève de moins en moins sur chacune de vos ventes.",
    reperes: ["10 OFFRES ACTIVES", "RÉVISION DU PRIX", "FRAIS SELON COMPÉTENCE"],
  },
  {
    cle: "commandes",
    onglet: "Commandes",
    fond: "/captures/marche-commandes.avif",
    surtitre: SURTITRE,
    titre: "Gagnez de l'or",
    accent: "avec le métier des autres.",
    texte:
      "Toutes les commandes ouvertes du royaume, tous métiers confondus. Choisissez celle qui vous arrange, fabriquez-la, encaissez la commission — et gagnez au passage du Renom, qui n'existe nulle part ailleurs. Il y en a toujours à prendre.",
    reperes: ["OUVERTES À TOUS", "L'ARTISAN SE PAIE", "REPRISE APRÈS 30 MIN"],
  },
  {
    cle: "creer",
    onglet: "Créer",
    fond: "/captures/marche-creer.avif",
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
    surtitre: SURTITRE,
    titre: "Poussez une pièce",
    accent: "au-delà de la forge.",
    texte:
      "Trempe volcanique, gravure draconique, cémentation abyssale. Déposez votre pièce, choisissez le traitement, et un Maître qui l'a cherché aux Archives le pose. C'est irréversible — et c'est ce qui sépare un bon équipement du vôtre.",
    reperes: ["PAR LES MAÎTRES", "UN À LA FOIS", "IRRÉVERSIBLE"],
  },
];
