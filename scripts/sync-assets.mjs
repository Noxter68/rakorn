/**
 * Recopie, depuis `apps/web/public`, les seules illustrations que cette page
 * cite réellement.
 *
 * Le dossier `public/` du jeu pèse trois cent cinquante mégaoctets. Une
 * vitrine en emploie une quarantaine de fichiers : les dupliquer tous pour en
 * servir un pour cent alourdirait le dépôt d'autant, et le futur projet séparé
 * hériterait de la même dette le jour où on l'en détachera.
 *
 * D'où le parti pris : **aucune liste à tenir à jour**. Le script relit les
 * sources, y relève les chemins `/game/...`, et copie ceux-là. Ajouter une
 * image à la page, c'est écrire son chemin dans le JSX puis relancer
 * `pnpm --filter landing-preview assets` — il n'y a pas de manifeste à ne pas
 * oublier, donc pas de manifeste à oublier.
 *
 * **La contrepartie : un chemin doit s'écrire en entier, dans une seule
 * chaîne.** Factoriser un dossier commun — `DOSSIER + "trone-de-braise.avif"` —
 * le rend invisible au relevé, et l'image manque à l'exécution sans que rien
 * n'ait échoué à la compilation. C'est arrivé aux huit expéditions de guilde.
 * La répétition de quelques préfixes est le prix de la simplicité du reste.
 *
 * ── Les illustrations rétrécissent en chemin ──────────────────────────────
 *
 * Le jeu sert ses images à leur pleine taille : il les affiche grandes, et
 * lui seul sait laquelle passera un jour en plein écran. La vitrine, non —
 * elle montre des vignettes. Relevé dans le navigateur, l'écart est brutal :
 * `UI/icons/xp.avif` pèse 379 ko en 1254 px de large pour paraître à 32. Le
 * dossier entier faisait 27,5 Mo dont vingt de pixels que personne ne voit.
 *
 * D'où le retaillage à la copie, sur deux règles et pas une de plus :
 *
 *   — un décor plein cadre — repéré à sa clef `fond:` dans `src/lib/landing`,
 *     donc jamais à tenir à jour — descend à 1920 px, la largeur d'un grand
 *     écran ;
 *   — tout le reste tombe au budget de sa famille, table ci-dessous, calculée
 *     comme le double du plus grand affichage relevé. Le double, parce qu'un
 *     écran Retina demande deux pixels pour un.
 *
 * Une image déjà sous son budget est copiée telle quelle : on ne ré-encode
 * pas pour rien, chaque passage en AVIF coûtant une génération de qualité.
 *
 * `public/game/` est versionné depuis que la vitrine part seule chez son
 * hébergeur : il lui faut ses images dans son dépôt. C'est le retaillage qui
 * rend la chose supportable — huit mégaoctets, pas vingt-huit.
 */

import { constants, copyFile, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ICI = dirname(fileURLToPath(import.meta.url));
const APP = resolve(ICI, "..");
/**
 * Le dossier d'images du jeu.
 *
 * Voisin tant que la vitrine vit dans le monorepo. Une fois partie dans son
 * propre dépôt elle ne l'a plus sous la main, et c'est très bien : ses images
 * y sont versionnées, la page se construit sans jamais rejouer ce script.
 * Il ne sert plus qu'à les rafraîchir quand l'illustration du jeu change, et
 * il faut alors lui dire où le jeu se trouve :
 *
 *     RPG_WEB_PUBLIC=../rpg-game/apps/web/public pnpm assets
 */
const SOURCE = process.env.RPG_WEB_PUBLIC
  ? resolve(process.env.RPG_WEB_PUBLIC)
  : resolve(APP, "..", "web", "public");
const CIBLE = join(APP, "public");

/** Les fichiers qu'on fouille : le JSX, les données, et la feuille de style. */
const SOURCES_LUES = /\.(tsx?|mts|mjs|css)$/;
/** Un chemin d'asset tel qu'il s'écrit dans le code, entre guillemets ou dans un `url()`. */
const CHEMIN = /\/game\/[A-Za-z0-9._/-]+\.(?:avif|webp|png|jpe?g|svg|mp4|webm)/g;
/** Un décor de scène, tel que les fichiers de `src/lib/landing` le déclarent. */
const FOND = /\bfond:\s*["'](\/game\/[^"']+)["']/g;

/** Largeur d'un décor plein cadre, et la qualité qu'un grand format demande. */
const PLEIN_CADRE = 1920;
const Q_DECOR = 74;
/** Une vignette encaisse une compression plus franche : on la voit petite. */
const Q_VIGNETTE = 62;

/**
 * Le budget de largeur par famille — le double du plus grand affichage relevé
 * au navigateur, arrondi.
 *
 * Le premier motif qui accroche gagne, d'où l'ordre : `guild/background` avant
 * le reste de `UI/`. Une famille absente de la table retombe sur le défaut,
 * large exprès — mieux vaut une image trop fine qu'une image floue, et le tort
 * se répare en ajoutant une ligne.
 */
const BUDGETS = [
  [/^\/game\/UI\/guild\/background\//, 1600],
  [/^\/game\/profession\//, 896],
  [/^\/game\/map\//, 832],
  [/^\/game\/UI\/(?:campagne|pages)\//, 704],
  [/^\/game\/ressources\//, 384],
  [/^\/game\/house-master\//, 320],
  [/^\/game\/UI\/(?:combat|market|icons|navigation)\//, 256],
  [/^\/game\/interactive-map\//, 256],
];
const BUDGET_DEFAUT = 768;

async function fichiers(racine) {
  const trouves = [];
  for (const entree of await readdir(racine, { withFileTypes: true })) {
    if (entree.name === "node_modules" || entree.name.startsWith(".")) continue;
    const chemin = join(racine, entree.name);
    if (entree.isDirectory()) trouves.push(...(await fichiers(chemin)));
    else if (SOURCES_LUES.test(entree.name)) trouves.push(chemin);
  }
  return trouves;
}

const cites = new Set();
const decors = new Set();
for (const fichier of await fichiers(join(APP, "src"))) {
  const texte = await readFile(fichier, "utf8");
  for (const trouve of texte.matchAll(CHEMIN)) cites.add(trouve[0]);
  for (const trouve of texte.matchAll(FOND)) decors.add(trouve[1]);
}

/** Ce qu'une image a le droit de peser en pixels, et à quelle qualité. */
function budget(chemin) {
  if (decors.has(chemin)) return { largeur: PLEIN_CADRE, qualite: Q_DECOR };
  const trouve = BUDGETS.find(([motif]) => motif.test(chemin));
  return { largeur: trouve ? trouve[1] : BUDGET_DEFAUT, qualite: Q_VIGNETTE };
}

// On repart d'un dossier vide. Une image qu'on cesse de citer — le wordmark
// « Valoria », par exemple — resterait sinon en place indéfiniment, et le
// projet séparé emporterait le jour du détachement des fichiers que plus
// personne n'affiche. Le dossier n'appartient qu'à ce script et il est ignoré
// par git : rien d'autre n'y vit qui pourrait être perdu.
await rm(join(CIBLE, "game"), { recursive: true, force: true });

let copies = 0;
let retaillees = 0;
let octets = 0;
let octetsSource = 0;
const manquants = [];

for (const chemin of [...cites].sort()) {
  const depuis = join(SOURCE, chemin);
  const vers = join(CIBLE, chemin);

  let infos;
  try {
    infos = await stat(depuis);
  } catch {
    manquants.push(chemin);
    continue;
  }
  await mkdir(dirname(vers), { recursive: true });
  octetsSource += infos.size;
  copies += 1;

  /* Seuls les AVIF se retaillent. Une texture WebP se répète ou s'étire en
     neuf tranches : la rétrécir décalerait le motif ou baverait le cadre. Et
     ce qui n'est pas une image — SVG, vidéo — passe évidemment tel quel. */
  const { largeur, qualite } = budget(chemin);
  const source = chemin.endsWith(".avif") ? await sharp(depuis).metadata() : null;

  if (source && source.width > largeur) {
    await sharp(depuis)
      .resize({ width: largeur, withoutEnlargement: true })
      .avif({ quality: qualite, effort: 6 })
      .toFile(vers);
    retaillees += 1;
    octets += (await stat(vers)).size;
  } else {
    await copyFile(depuis, vers, constants.COPYFILE_FICLONE);
    octets += infos.size;
  }
}

const mo = (octets / 1024 / 1024).toFixed(1);
const moSource = (octetsSource / 1024 / 1024).toFixed(1);
console.log(
  `${copies} illustrations copiées depuis ${relative(APP, SOURCE)} (${mo} Mo).\n` +
    `${retaillees} retaillées — ${moSource} Mo à la source, ${mo} Mo servis.`,
);

if (manquants.length) {
  console.error(`\n${manquants.length} introuvable(s) dans apps/web/public :`);
  for (const chemin of manquants) console.error(`  ${chemin}`);
  // Une page qui cite une image absente s'affiche avec un trou : autant que la
  // commande le dise fort plutôt que de le laisser découvrir au navigateur.
  process.exitCode = 1;
}
