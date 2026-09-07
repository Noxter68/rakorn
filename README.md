# rakorn-landing

La vitrine de Rakorn : neuf scènes plein écran, montées sur les assets du jeu.

Elle ne dépend ni du jeu, ni d'une session, ni de `@rpg/shared`, et ses onze
scènes rendent en statique. Elle vivait dans le monorepo du jeu, le temps
d'arrêter sa forme ; elle en est sortie et n'y revient pas.

Une seule route est dynamique, `/api/beta` : l'inscription à la bêta, qui
dépose l'adresse dans une audience Resend et renvoie un accusé de réception.
C'est la seule chose que la page demande, et le seul secret qu'elle détienne.

```bash
pnpm install
cp .env.example .env.local   # les clés Resend, et rien d'autre
pnpm dev                     # http://localhost:3002
```

## L'inscription

Trois boutons — la barre du haut, l'ouverture, la clôture — ouvrent la même
fenêtre, montée une seule fois au pied de `page.tsx`. Aucun ne mène au jeu :
tant que la bêta n'est pas ouverte, un bouton « Jouer » dépense en une seconde
la confiance que neuf scènes viennent de bâtir. Le jour venu, on rebranche les
trois `href` — une ligne par bouton.

L'adresse est vérifiée deux fois par le même code, `lib/landing/courriel.ts` :
dans le navigateur pour répondre sans attendre le réseau, sur le serveur parce
qu'une requête n'a pas à passer par la page pour arriver. La vérification
n'est pas une liste blanche de fournisseurs — elle refuserait toutes les
adresses professionnelles, et `support@rakorn.fr` en premier. Elle écarte les
boîtes jetables, et propose une correction quand le domaine est un fournisseur
connu mal tapé.

## Les illustrations

Elles sont **dans ce dépôt**, et pas seulement citées : l'hébergeur ne
construit que ce qu'il reçoit. Ce ne sont pas les fichiers du jeu pour autant
— `scripts/sync-assets.mjs` les retaille aux dimensions où cette page les
montre, ce qui ramène le dossier de vingt-huit mégaoctets à dix.

Il n'y a donc rien à lancer pour construire. Le script ne ressert que le jour
où une illustration change chez le jeu, et il faut alors lui dire où il est :

```bash
RPG_WEB_PUBLIC=../rpg-game/apps/web/public pnpm assets
```

## La règle

Une seule, tenue neuf fois :

- le décor prend tout l'écran, et rien ne le recouvre ;
- les onglets se tiennent en haut, en un mot et un trait ;
- le titre en bas à gauche, ce qu'il faut en savoir en bas à droite ;
- ce qui flotte au milieu ne flotte que s'il démontre quelque chose ;
- aucun cadre autour du contenu.

La tentation, à chaque section, est d'ajouter un panneau pour « caler » ce
qu'on y met. C'est ainsi qu'une vitrine devient un tableau de bord. L'espace
vide est le sujet : c'est l'illustration qu'on est venu voir.

## L'architecture

`TabbedScene` est le moteur : six sections en dépendent (métiers, marché,
équipement, combat, campagne, guilde), parce qu'elles font toutes la même
chose — une rangée d'onglets change le décor, le texte et la surimpression.
Les surimpressions lui arrivent **déjà rendues**, en tableau de nœuds : elles
contiennent des dizaines d'illustrations qui ne changent jamais après le
premier rendu, et les composer côté client n'aurait servi à rien.

`ScrollDirector` est le seul écouteur de défilement de la page. Jauge de
progression, état de la barre du haut et parallaxe des décors passent par une
unique passe de `requestAnimationFrame` : on lit, puis on écrit. Trois
écouteurs séparés auraient donné trois lectures de la géométrie du document au
même instant — c'est ainsi qu'on obtient une page qui saccade sans qu'aucun
calcul pris à part ne soit coûteux.

La progression s'écrit sur la **scène**, jamais sur le décor : mesurer un
élément déjà transformé rend une position qui dépend de sa propre translation,
et la parallaxe se met à osciller.

Mesuré au navigateur sur un parcours complet : intervalle médian 8,3 ms,
95ᵉ centile 16,7 ms, aucune image au-delà de 24 ms, aucune tâche longue.

## Les données

Une scène par fichier dans `src/lib/landing/`. Rien d'inventé : les huit
métiers et leurs objets, les huit zones et leurs boss, les bâtiments de guilde
et les huit expéditions sortent tous du contenu du jeu, et les chiffres —
455 objets, 111 filons, 1 001 hauts faits — de la base.

La scène des métiers ne raconte pas huit chaînes de fabrication mais **une
seule boucle, montrée huit fois** : récolter, fabriquer, échanger, compléter.
Les verbes sont les mêmes pour tout le monde, seuls les objets changent — c'est
ce qui fait comprendre que la règle est commune et que le métier n'est qu'une
manière de l'habiter.

## Les captures du jeu

Deux séries, prises sur le jeu qui tourne : les quatre salles du Marché, et les
infobulles des huit pièces d'exception.

```bash
pnpm --filter landing-preview captures
```

Il faut pour cela que la pile locale soit debout : Postgres et Redis
(`docker compose up -d`, ports 5433 et 6380), l'API sur 3001, le jeu sur 3000.
Le script forge son jeton avec le secret de développement plutôt que de passer
par l'écran de connexion — un mot de passe de moins à tenir à jour dans un
script.

## L'aperçu visuel

Huit sections racontent des systèmes — la boucle des métiers, les rangs de
gemmes, les paliers d'ensemble — avec les illustrations du jeu mais presque
jamais ses écrans. On pouvait tout lire et n'avoir aucune idée de ce à quoi le
jeu ressemble une fois ouvert. La galerie ne raconte rien : dix captures de
pages réelles, en onglets, la capture servant de décor comme au marché.

Elles portent les chiffres d'un personnage de niveau soixante — sac plein,
métiers hauts, Maison achevée. C'est délibéré : un écran vide ne montre pas un
jeu, il montre un formulaire.

## La fiche d'objet

Elle a fait le chemin inverse des captures. Elle en était une : une image ne
monte pas en taille, au double elle bavait — et c'est précisément la fiche
qu'on veut pouvoir agrandir, puisque c'est là qu'on lit ce qu'une pièce vaut.

Elle est maintenant **rendue en HTML** — `item-fiche.tsx` pour le balisage,
`fiches.ts` pour les données. Le balisage, les classes et le bloc de style sont
copiés du jeu, règle pour règle : c'est la seule duplication assumée de la
vitrine, et elle remplace quelque chose de pire. Porter le composant réel
aurait demandé `@rpg/shared`, les gemmes, les raretés, les panoplies et la
comparaison d'équipement, quand la vitrine ne dépend de rien — ce qui lui a
permis de partir dans son propre dépôt.

Les chiffres sont relevés dans la base, objet par objet. Deux choses sont mises
en scène et se voient : le nombre de pièces portées d'un ensemble, et les trois
topazes serties sur la Lame du Serment. Aucun visiteur n'a de personnage ; il
fallait bien décider ce qu'il porte pour que les paliers et le sertissage aient
quelque chose à montrer. Les valeurs, elles, restent celles du jeu.

Les images atterrissent dans `public/captures/`, **qui est dans git** : elles
ne viennent pas de `apps/web/public`, elles sont produites ici, et rien ne les
régénérerait après un clone. À ne pas confondre avec `public/game/`, ci-dessous.

Une version antérieure de cette section reconstituait un tableau de prix en
HTML. C'était une imitation : plus pauvre que la vraie salle, et surtout
menteuse, puisqu'un visiteur ne l'aurait jamais retrouvée en jouant. Une
capture, elle, ne peut pas diverger du produit sans qu'on le voie.

La scène de combat, elle, montre les planches de compétences du jeu et sa
carte de tactique — quatre coups par approche, avec leurs vrais noms et leurs
vrais textes.

## Ce que chaque section doit prouver

Une vitrine de jeu d'équipement qui n'affiche aucune statistique n'annonce
rien. La forge montre donc, pour chaque onglet, ce que la chose *fait* : les
pièces portent leur nom en couleur de rareté et livrent la fiche du jeu au
survol ; les traitements, qui n'ont pas de fiche d'objet, portent leurs
chiffres en clair — emplacement, rangs, gain cumulé au maximum ; les gemmes
montrent le gain par rang, l'échelle des cinq crans, le total au rang V et la
prime d'accord. Tout vient de `master-tree.ts` et de `gems.ts`.

## Les lieux qu'on ouvre

La cité de guilde et les huit expéditions sont des tableaux peints, pas des
objets détourés : à dix rem de large on devine un lieu sans le voir. Le clic
les rend à leur taille, sur un fond flouté qui garde la scène derrière plutôt
que de la faire disparaître — on doit sentir qu'on est resté sur la même page.
Trois manières de fermer, parce qu'on en essaie toujours une avant l'autre : la
croix, le fond, et Échap.

## La Route du Voyageur

La scène de campagne est la seule à ne pas suivre le gabarit : elle reprend la
disposition de l'écran de campagne du jeu — titre en haut à gauche, rangée de
chapitres en bas, panneau de détail à droite. Montrer un écran de jeu dans sa
propre disposition en dit plus qu'un texte qui le décrirait dans une autre.

Vie, attaque, armure, parade et expérience sont relevées sur `CampaignMonster`,
pas estimées : un boss dont on gonflerait les points de vie pour la vitrine se
ferait démentir au premier combat.

Le niveau affiché est le **niveau attendu**, celui du jeu — pas le rang dans la
zone. Tous les boss sont quinzièmes de la leur, et écrire « niveau 15 » sur le
Roi sous la Montagne annonçait un gobelin là où se tient ce qui clôt la
campagne. Il se calcule sur l'expérience cumulée du bestiaire : 5, 15, 30, 48,
58 pour les cinq que la vitrine montre.

## Les illustrations

`public/game/` **n'est pas dans git** : ce sont des copies de `apps/web/public`,
et le dépôt n'a pas à porter deux fois les mêmes trois cent cinquante
mégaoctets. Après un clone, ou après avoir cité une nouvelle image :

```bash
pnpm --filter landing-preview assets
```

Le script relit les sources, y relève tous les chemins `/game/…` — JSX comme
CSS —, vide le dossier et copie ceux-là. Il n'y a pas de liste à tenir à jour,
il purge ce qu'on a cessé de citer, et il sort en erreur si la page réclame une
image absente. Une centaine de fichiers, dix-sept mégaoctets, contre trois cent
quarante-neuf pour le dossier complet du jeu.

**Un chemin doit s'écrire en entier, dans une seule chaîne.** Factoriser un
dossier commun — `DOSSIER + "trone-de-braise.avif"` — le rend invisible au
relevé, et l'image manque à l'exécution sans que rien n'ait échoué à la
compilation.

Le jour du détachement, ce dossier sera là : il suffira de le mettre dans git
et de supprimer le script.

## Deux écarts avec le jeu

- **Les liens sortent.** Les boutons mènent à `JEU_URL` en absolu — une route
  interne aurait donné un 404 au seul endroit où le visiteur dit oui. Voir
  `.env.example`.
- **Le titre n'est pas une planche.** Les deux wordmarks du dépôt disent
  « Valoria Online », l'ancien nom. Reste l'emblème, qui ne dit rien, et
  « Rakorn » composé en Cinzel — qui se sélectionne, se lit à voix haute et se
  trouve dans un moteur de recherche.
