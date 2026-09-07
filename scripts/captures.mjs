/**
 * Photographie le jeu pour la vitrine : les quatre salles du Marché, et les
 * dix pages de la galerie d'aperçu.
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
  { cle: "metiers", route: "/crafting", attente: ".rpg-met" },
  /* Deux clics : un métier, puis une de ses pièces. Le Codex s'ouvre sur
     « Aucune entrée choisie » — une liste et une colonne vide —, et c'est la
     fiche de droite qu'on veut montrer, pas le sommaire. */
  { cle: "codex", route: "/codex", attente: ".rpg-cdx", geste: [".rpg-cdx-job", ".rpg-cdx-find"] },
  { cle: "contrats", route: "/orders", attente: ".rpg-ord" },
  { cle: "competences", route: "/skills", attente: ".rpg-board-page" },
  { cle: "personnage", route: "/character", attente: ".rpg-per" },
  { cle: "inventaire", route: "/inventory", attente: ".rpg-board-page" },
  { cle: "campagne", route: "/map", attente: ".rpg-camp-card, .rpg-campaign-strip" },
  { cle: "forge", route: "/forge", attente: ".rpg-board-page" },
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
     — Ouvertes, Créer, Mes commandes, Confier une pièce, Traitements — et la
     vitrine n'en montrait qu'une, celle qui s'ouvre par défaut. Passer une
     commande, confier une pièce à un artisan et la faire traiter sont trois
     gestes distincts, et deux d'entre eux n'existaient nulle part sur la
     page. */
  { cle: "creer", onglet: "COMMANDES", sous: "Créer" },
  { cle: "confier", onglet: "COMMANDES", sous: "Confier une pièce" },
  { cle: "traitements", onglet: "COMMANDES", sous: "Traitements" },
];

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

  for (const salle of SALLES) {
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
  }

  // ── Les salles du jeu, pour la galerie d'aperçu ─────────────────────────
  const galerie = await ctx.newPage();
  for (const salle of SALLES_JEU) {
    try {
      await galerie.goto(`${JEU}${salle.route}`, { waitUntil: "networkidle" });
      await galerie.waitForSelector(salle.attente, { timeout: 15000 });
      await galerie.waitForTimeout(2500);
      // Un clic manqué n'est pas fatal : la page a déjà de quoi se montrer, et
      // une galerie amputée d'un onglet vaut mieux qu'un script qui s'arrête au
      // huitième.
      for (const cible of [salle.geste ?? []].flat()) {
        await galerie
          .locator(cible)
          .first()
          .click({ timeout: 5000 })
          .catch(() => console.log(`  (${salle.cle} : « ${cible} » introuvable)`));
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
} finally {
  await nav.close();
}

console.log(`\n${SALLES.length} salles du Marché et ${SALLES_JEU.length} pages du jeu écrites dans public/captures/.`);
