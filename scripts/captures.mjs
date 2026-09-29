/**
 * Photographie le jeu pour la vitrine : les quatre salles du Marché, les
 * dix pages de la galerie d'aperçu, et la carte de la conquête.
 *
 * Elle montrait d'abord un tableau de prix reconstitué en HTML : une imitation,
 * plus pauvre que la vraie salle et surtout menteuse, puisqu'un visiteur ne
 * l'aurait jamais retrouvée en jouant. Une capture, elle, ne peut pas diverger
 * du produit sans qu'on le voie.
 *
 * Les fiches d'objet ont fait le chemin inverse : capturées d'abord, elles sont
 * maintenant rendues en HTML — voir `item-fiche.tsx`. Une image ne monte pas en
 * taille, et c'est précisément la fiche qu'on veut agrandir. Un écran de salle,
 * lui, se regarde entier : la capture y reste la bonne réponse.
 *
 * Il faut que la pile locale tourne : Postgres et Redis (`docker compose up
 * -d`, ports 5433 et 6380), l'API sur 3001, le jeu sur 3000.
 *
 *   pnpm --filter landing-preview captures
 *   pnpm captures conquete        # une seule série : marche, galerie, conquete
 *   pnpm captures galerie --sans=maison,archives   # tout sauf ces prises-là
 *
 * L'authentification est forgée à la main plutôt que jouée au formulaire : le
 * jeton est signé avec le secret de développement, et le cookie ne sert qu'à
 * passer la garde du middleware, qui ne vérifie que sa présence. Un mot de
 * passe de moins à tenir à jour dans un script.
 */

import { createHmac } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";

const ICI = dirname(fileURLToPath(import.meta.url));
const APP = join(ICI, "..");
const CIBLE = join(APP, "public", "captures");
const JEU = process.env.JEU_URL ?? "http://localhost:3000";
const SECRET = process.env.JWT_SECRET ?? "change-me-in-production";
const JOUEUR = process.env.CAPTURE_SUB ?? "2d31f0b9-2d12-40f4-b8e5-0965198adebf";
const COURRIEL = process.env.CAPTURE_EMAIL ?? "dorn@recrue.test";

/**
 * Les salles du jeu, pour la galerie d'aperçu.
 *
 * Une page par onglet, photographiée telle qu'un joueur la trouve. Certaines
 * ne montrent rien tant qu'on n'a rien désigné — le Codex ouvre sur une liste
 * et une colonne vide, la Maison sur un hall — d'où le `geste` : un clic, une
 * fois la page montée, sur ce qui la fait parler.
 *
 * `attente` est le sélecteur qui dit que la page est là. L'attendre plutôt que
 * de compter les secondes évite de photographier un chargeur, et de rallonger
 * l'attente « au cas où » pour les dix.
 */
const SALLES_JEU = [
  /* La salle s'ouvre sur le métier actif du personnage, qui n'est pas
     forcément son meilleur — celui de Dorn est un bûcheron de niveau sept, à
     côté de deux métiers au soixante. On passe au Forgeron, à l'établi, et
     sur une pièce majeure : c'est elle qui montre ce qu'on vient chercher. */
  {
    cle: "metiers",
    route: "/crafting",
    attente: ".rpg-met",
    geste: [
      '.rpg-met-job:has-text("Forgeron")',
      '.rpg-met-tab:has-text("Artisanat")',
      '.rpg-met-row:has-text("Épée du magma éternel")',
    ],
  },
  /* Le Codex s'ouvre sur la première entrée de l'aperçu, une aiguille
     commune. La recherche rend l'ensemble du Serment en entier — douze pièces
     mythiques dans la grille —, et sa lame occupe la scène. */
  {
    cle: "codex",
    route: "/codex",
    attente: ".rpg-cdx",
    geste: [
      { champ: "input[placeholder^='Rechercher']", texte: "Serment" },
      '.rpg-plan-case[aria-label^="Lame du Serment"]',
    ],
  },
  /* Les trois écrans passés au plan ont perdu leur classe de salle : leur
     racine est `.rpg-plan`, et l'attente sur l'ancienne expirait. */
  { cle: "contrats", route: "/orders", attente: ".rpg-plan" },
  { cle: "competences", route: "/skills", attente: ".rpg-board-page" },
  { cle: "personnage", route: "/character", attente: ".rpg-per" },
  /* Le sac s'ouvre sur sa première case, une botte de sisal : on choisit une
     gemme légendaire, dont la fiche dit ce qu'elle apporte une fois sertie. */
  {
    cle: "inventaire",
    route: "/inventory",
    attente: ".rpg-plan",
    geste: '.rpg-plan-case[aria-label^="Saphir des profondeurs V "]',
  },
  { cle: "campagne", route: "/map", attente: ".rpg-camp-card, .rpg-campaign-strip" },
  /* La Forge s'ouvre sur une amulette commune « déjà en parfait état » : un
     établi qui n'a rien à faire. On prend une pièce légendaire usée aux
     cinq sixièmes, et le geste de réparer a de quoi se montrer. */
  {
    cle: "forge",
    route: "/forge",
    attente: ".rpg-plan",
    geste: '.rpg-plan-case[aria-label^="Bouclier du Roi sous la Montagne"]',
  },
  /* Le hall porte `.rpg-hall`, pas `.rpg-house` — cette dernière habille les
     salles ouvertes, pas la façade. Un sélecteur voisin, et le script attendait
     quinze secondes un élément qui n'arrive qu'au clic suivant. */
  { cle: "maison", route: "/house", attente: ".rpg-hall" },
  /* `text=Archives` visait le titre de la carte, pas la carte : le clic
     tombait sur un nœud de texte et le hall ne bougeait pas — la capture
     doublait celle du hall, à l'identique. */
  { cle: "archives", route: "/house", attente: ".rpg-hall", geste: 'button:has-text("ARCHIVES")' },
  { cle: "guilde", route: "/guild", attente: ".rpg-board-page" },
];

/** Les quatre modes du Marché, dans l'ordre où la salle les présente. */
const SALLES = [
  { cle: "acheter", onglet: "ACHETER" },
  { cle: "vendre", onglet: "VENDRE" },
  { cle: "mes-ventes", onglet: "MES VENTES" },
  { cle: "commandes", onglet: "COMMANDES" },
  /* Les trois vues qui vivent **sous** l'onglet Commandes. Le Marché en a cinq
     — Ouvertes, Créer, Mes commandes, Confier, Mes traitements — et la
     vitrine n'en montrait qu'une, celle qui s'ouvre par défaut. Passer une
     commande, confier une pièce à un artisan et la faire traiter sont trois
     gestes distincts, et deux d'entre eux n'existaient nulle part sur la
     page. Les libellés vont par paires depuis que le Marché porte l'habit du
     plan — *Créer / Mes commandes*, *Confier / Mes traitements* — et le clic
     les cherche au mot près : l'ancien « Confier une pièce » ne trouvait plus
     rien. */
  { cle: "creer", onglet: "COMMANDES", sous: "Créer" },
  { cle: "confier", onglet: "COMMANDES", sous: "Confier" },
  { cle: "traitements", onglet: "COMMANDES", sous: "Mes traitements" },
];

/**
 * La carte de la conquête, dans les états qu'elle sait prendre.
 *
 * Un royaume de développement est **au repos** : personne n'y tient rien, et
 * une capture de la carte réelle montrerait vingt-cinq territoires dans le
 * même état — c'est-à-dire rien de ce qui fait le jeu. Le jeu a pour ça son
 * banc d'essai (`banc-etats.tsx`, en développement seulement) : un ruban
 * au-dessus de la carte qui pose des états fictifs — tenus, en siège, places
 * prises — sans rien écrire. On le choisit, puis on le cache avant la prise
 * de vue, avec l'indicateur de Next : aucun des deux n'existe en production.
 *
 * Le panneau de droite, lui, lit le serveur et dit la vérité. D'où le choix
 * des territoires ouverts : un lieu dont l'état fictif ne contredit pas la
 * fiche réelle — la capitale, qui reste sur sa situation dans « Tout à la
 * fois », ou n'importe quel lieu sous l'état réel. Les deux vues de guilde
 * n'ouvrent rien : leurs territoires sont tous tenus, et une fiche y aurait
 * dit « libre » à côté d'un sol peint aux couleurs d'une maison.
 *
 * Les cinq prises partagent le même cadrage au pixel : le fondu d'un onglet
 * à l'autre fait alors changer la carte **sur place**, et c'est ce
 * changement-là qu'on veut montrer.
 */
const CONQUETE = [
  { cle: "royaume", banc: "Tout à la fois", territoire: "rakorn" },
  /* « Situations » plutôt que « Places » : ce banc-là teint aussi les
     territoires de guilde aux couleurs d'une maison, et la vue d'un joueur
     seul ressemblait à celle d'une guerre. Ici, chaque lieu montre ce qu'il
     traverse — et c'est ce qu'on vient y chercher quand on joue seul. */
  { cle: "solo", banc: "Situations", territoire: "marche-des-routes" },
  { cle: "guilde", banc: "Tenus" },
  { cle: "siege", banc: "Siège" },
  { cle: "bonus", banc: "Réel", territoire: "citadelle-des-epaves" },
];

/**
 * Ce qu'on retire de chaque prise, sans rien déplacer.
 *
 * La barre du jeu est coupée par le cadrage, mais son globe pend au-dessous,
 * au milieu : on en voyait le bas en haut de chaque image. Masquée sans être
 * retirée, elle garde sa place et rien ne remonte. L'indicateur de Next, lui,
 * n'existe qu'en développement et se posait au coin inférieur gauche de
 * toutes les captures.
 */
const HABILLAGE = ".rpg-topnav { visibility: hidden !important; } nextjs-portal { display: none !important; }";
const habiller = (onglet) => onglet.addStyleTag({ content: HABILLAGE });

/** Les séries demandées en argument ; aucune, c'est toutes. */
const SERIES = new Set(process.argv.slice(2).filter((a) => !a.startsWith("--")));
const veut = (serie) => SERIES.size === 0 || SERIES.has(serie);

/**
 * Les prises à laisser telles quelles, par leur clef : un écran en cours de
 * refonte garde sa capture précédente plutôt que d'en recevoir une à moitié
 * refaite.
 */
const SANS = new Set(
  (process.argv.find((a) => a.startsWith("--sans="))?.slice("--sans=".length) ?? "")
    .split(",")
    .filter(Boolean),
);

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const corps = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({
  sub: JOUEUR,
  email: COURRIEL,
  iat: Math.floor(Date.now() / 1000),
})}`;
const jeton = `${corps}.${createHmac("sha256", SECRET).update(corps).digest("base64url")}`;

await mkdir(CIBLE, { recursive: true });

const nav = await chromium.launch();

try {
  /* Double densité. À densité 1, la source faisait mille six cents pixels de
     large pour un décor affiché sur deux mille quatre cents pixels réels d'un
     écran Retina : une image agrandie d'une fois et demie, et un texte
     d'interface qui bave. C'est le seul défaut de netteté de la page que l'on
     puisse corriger — les illustrations du jeu, elles, n'existent qu'en mille
     six cent soixante-douze pixels. */
  const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await ctx.addCookies([{ name: "rpg_access_token", value: "1", domain: "localhost", path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("rpg_access_token", t), jeton);
  const page = await ctx.newPage();

  // ── Les quatre salles du Marché ─────────────────────────────────────────
  await page.goto(`${JEU}/market`, { waitUntil: "networkidle" });
  await page.waitForSelector(".rpg-mkt", { timeout: 20000 });
  await page.waitForTimeout(3000);

  // La barre du jeu est retirée à la prise de vue : la capture sert de décor à
  // la vitrine, qui a déjà la sienne. Les garder toutes les deux donnait deux
  // barres l'une sur l'autre et deux rangées d'onglets disant la même chose.
  // Sa hauteur est **mesurée** et non écrite : elle vient d'un `min-height` en
  // rem plus deux rembourrages, et l'avoir devinée à soixante-dix-huit pixels
  // laissait dix pixels d'icônes dans le cadre.
  const barre = Math.round(
    await page.locator(".rpg-topnav").first().evaluate((el) => el.getBoundingClientRect().height),
  );
  console.log(`barre du jeu : ${barre} px, retirés du cadrage`);
  await habiller(page);

  for (const salle of veut("marche") ? SALLES : []) {
    await page.locator(".rpg-mkt-mode", { hasText: salle.onglet }).first().click();
    // Les colonnes se remplissent après la requête ; trois secondes évitent de
    // photographier un écran à moitié monté.
    await page.waitForTimeout(3000);
    if (salle.sous) {
      await page
        .getByRole("button", { name: salle.sous, exact: true })
        .first()
        .click({ timeout: 5000 });
      await page.waitForTimeout(2500);
    }
    const png = await page.screenshot({
      clip: { x: 0, y: barre, width: 1920, height: 1080 - barre },
    });
    // En AVIF plutôt qu'en PNG : deux mégaoctets par capture sur une page qu'on
    // veut légère. La qualité 56 tient largement pour un écran d'interface, qui
    // est surtout du texte sur du sombre.
    await sharp(png)
      /* Mille neuf cent vingt, la largeur du plus grand écran visé. La prise
         est faite en densité deux, donc en 3840 : c'est cette moitié-là qu'on
         garde. Les capturer en 3200 doublait leur poids pour des pixels que
         la page n'affiche nulle part. */
      .resize({ width: 1920, withoutEnlargement: true })
      /* Soixante-dix et non cinquante-six : `next/image` réencode ces fichiers
         en AVIF avant de les servir, et une seconde passe avec perte sur une
         image déjà pauvre ne rattrape rien. Mieux vaut lui donner de quoi
         travailler. */
      .avif({ quality: 70 })
      .toFile(join(CIBLE, `marche-${salle.cle}.avif`));
    console.log(`marche-${salle.cle}.avif`);
    /* L'ouverture de la vitrine montre « Acheter » en vitrine de produit, au
       centre et en grand : c'est la première image qu'on voit, et elle est
       affichée jusqu'à mille trois cents pixels de large — sur un écran à
       double densité, la version à 1 920 y serait déjà agrandie. On garde
       donc 2 560 de la prise en densité deux, pour elle seule. */
    if (salle.cle === "acheter") {
      await sharp(png)
        .resize({ width: 2560, withoutEnlargement: true })
        .avif({ quality: 68 })
        .toFile(join(CIBLE, "ouverture-marche.avif"));
      console.log("ouverture-marche.avif");
    }
  }

  // ── Les salles du jeu, pour la galerie d'aperçu ─────────────────────────
  const galerie = await ctx.newPage();
  for (const salle of veut("galerie") ? SALLES_JEU.filter((s) => !SANS.has(s.cle)) : []) {
    try {
      await galerie.goto(`${JEU}${salle.route}`, { waitUntil: "networkidle" });
      await galerie.waitForSelector(salle.attente, { timeout: 15000 });
      await habiller(galerie);
      await galerie.waitForTimeout(2500);
      // Un clic manqué n'est pas fatal : la page a déjà de quoi se montrer, et
      // une galerie amputée d'un onglet vaut mieux qu'un script qui s'arrête au
      // huitième.
      /* Un geste est un clic, ou une saisie quand il porte un champ. */
      for (const cible of [salle.geste ?? []].flat()) {
        const quoi = typeof cible === "string" ? cible : cible.champ;
        const lieu = galerie.locator(quoi).first();
        await (typeof cible === "string"
          ? lieu.click({ timeout: 5000 })
          : lieu.fill(cible.texte, { timeout: 5000 })
        ).catch(() => console.log(`  (${salle.cle} : « ${quoi} » introuvable)`));
        await galerie.waitForTimeout(1800);
      }
      const png = await galerie.screenshot({
        clip: { x: 0, y: barre, width: 1920, height: 1080 - barre },
      });
      await sharp(png)
        .resize({ width: 1920, withoutEnlargement: true })
        .avif({ quality: 70 })
        .toFile(join(CIBLE, `jeu-${salle.cle}.avif`));
      console.log(`jeu-${salle.cle}.avif`);
    } catch (erreur) {
      console.error(`  ${salle.cle} : ${String(erreur).slice(0, 120)}`);
    }
  }

  // ── La carte de la conquête ─────────────────────────────────────────────
  const carte = await ctx.newPage();
  for (const vue of veut("conquete") ? CONQUETE : []) {
    await carte.goto(`${JEU}/conquete${vue.territoire ? `?t=${vue.territoire}` : ""}`, {
      waitUntil: "networkidle",
    });
    await carte.waitForSelector(".rpg-carte-marqueur", { timeout: 20000 });
    await carte.waitForTimeout(2000);
    await carte.locator(".rpg-banc-etats button", { hasText: vue.banc }).first().click();
    /* Le pointeur repart dans la marge de gauche : laissé sur le ruban, il
       survolerait après coup le territoire du haut, qui s'allume au survol. */
    await carte.mouse.move(90, 600);
    await carte.addStyleTag({ content: ".rpg-banc-etats { display: none !important; }" });
    await habiller(carte);
    /* Le temps que les marqueurs finissent de changer — un territoire qui
       passe à nous bat une fois. */
    await carte.waitForTimeout(1600);
    const png = await carte.screenshot({
      clip: { x: 0, y: barre, width: 1920, height: 1080 - barre },
    });
    await sharp(png)
      .resize({ width: 1920, withoutEnlargement: true })
      .avif({ quality: 70 })
      .toFile(join(CIBLE, `conquete-${vue.cle}.avif`));
    console.log(`conquete-${vue.cle}.avif`);
  }
} finally {
  await nav.close();
}

console.log(`\nÉcrit dans public/captures/ : ${[...(SERIES.size ? SERIES : ["marche", "galerie", "conquete"])].join(", ")}.`);
