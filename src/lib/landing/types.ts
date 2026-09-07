/**
 * Le vocabulaire d'une scène.
 *
 * La page entière n'est qu'une suite de scènes bâties sur le même gabarit :
 * un décor qui prend tout l'écran, des onglets discrets en haut, un titre en
 * bas à gauche, un texte en bas à droite, et — seulement quand il démontre
 * quelque chose — un objet posé par-dessus. Décrire ce gabarit une fois ici
 * évite de le redécrire neuf fois en JSX.
 */

/** Une pièce posée en surimpression : une illustration, un nom, son rang. */
export interface Piece {
  art: string;
  nom: string;
  /** Où elle se situe dans la chaîne — « Filon », « Lingot », « Légendaire ». */
  palier: string;
}

/**
 * Un repère chiffré, avec son emblème : la rangée qui ferme le bas de scène.
 *
 * Les emblèmes sont ceux du jeu — l'enclume de la barre de navigation, le
 * codex, le grimoire de compétences. Une rangée de mots seuls se lisait comme
 * une ligne de tags ; les mêmes chiffres sous leur emblème se lisent comme le
 * bandeau de fin d'une jaquette, ce qu'ils sont.
 */
export interface Repere {
  art: string;
  /** Le nombre, ou le mot qui en tient lieu — « 313 », « ÉCONOMIE ». */
  valeur: string;
  /** Ce qu'il compte, en un ou deux mots. */
  quoi: string;
  /**
   * Vrai pour le repère qui annonce un survol.
   *
   * « Survolez pour la fiche » est un mensonge sur un écran tactile, où rien
   * ne se survole — et c'est le seul des repères qui promette un geste plutôt
   * que d'énoncer un nombre. La feuille de style le retire quand le pointeur
   * ne sait pas survoler.
   */
  survol?: boolean;
}

/**
 * Un onglet, c'est-à-dire un état complet de la scène.
 *
 * Le décor en fait partie : c'est lui qui change quand on passe d'un métier à
 * l'autre, et c'est ce changement qui porte tout l'effet. Le texte suit, la
 * surimpression aussi.
 */
export interface Onglet {
  cle: string;
  /** Le libellé du bouton, court — il vit dans une rangée. */
  onglet: string;
  /** Le décor plein écran. */
  fond: string;
  /** Le cadrage du décor, quand le centre n'est pas le bon endroit. */
  cadrage?: string;
  surtitre: string;
  titre: string;
  /** La fin du titre, en or. */
  accent?: string;
  texte: string;
  /**
   * Trois ou quatre repères lus en diagonale, sous le texte.
   *
   * Deux formes, et une scène n'en porte qu'une. `reperes` est la rangée de
   * mots d'origine ; `chiffres` la rangée d'emblèmes des trois scènes refaites
   * — métiers, forge, combat —, où le bas de scène doit tenir le regard aussi
   * fermement que la démonstration au-dessus.
   */
  reperes?: string[];
  chiffres?: Repere[];
}
