/**
 * Photographie le jeu pour la vitrine : le Marché, les Commandes, les
 * dix pages de la galerie d'aperçu et la carte de la conquête, en bureau
 * et dans le navigateur mobile.
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
 *   pnpm captures galerie --mobile-only
 *   pnpm captures marche --sans=acheter,vendre
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
const JOUEUR = process.env.CAPTURE_SUB ?? "258e3625-e8ad-4ca9-a6d9-db2952567ce9";
const COURRIEL = process.env.CAPTURE_EMAIL ?? "dorn@recrue.test";
const VENDEUR = process.env.CAPTURE_SELLER_SUB ?? "7c919502-c085-4614-9a84-bb09e7cd4b0c";

/**
 * Les salles du jeu, pour la galerie d'aperçu.
 *
 * Une page par onglet, photographiée telle qu'un joueur la trouve. Certaines
 * ne montrent rien tant qu'on n'a rien désigné — le Codex ouvre sur une liste
 * et une colonne vide — d'où le `geste` : un clic, une
 * fois la page montée, sur ce qui la fait parler.
 *
 * `attente` est le sélecteur qui dit que la page est là. L'attendre plutôt que
 * de compter les secondes évite de photographier un chargeur, et de rallonger
 * l'attente « au cas où » pour les dix.
 */
const SALLES_JEU = [
  /* Le Forgeron ouvre l'établi et montre ses recettes. */
  {
    cle: "metiers",
    route: "/crafting",
    attente: ".rpg-met",
    geste: [
      '.rpg-met-onglet[title^="Forgeron"]',
      '.rpg-met button:has-text("Artisanat"):visible',
    ],
  },
  /* La recherche du Serment peuple la grille et ouvre la première pièce. */
  {
    cle: "codex",
    route: "/codex",
    attente: ".rpg-cdx",
    geste: [
      { champ: "input[placeholder^='Rechercher']", texte: "Serment" },
    ],
  },
  /* Les trois écrans passés au plan ont perdu leur classe de salle : leur
     racine est `.rpg-plan`, et l'attente sur l'ancienne expirait. */
  { cle: "contrats", route: "/orders", attente: ".rpg-plan" },
  { cle: "competences", route: "/skills", attente: ".rpg-board-page" },
  { cle: "personnage", route: "/character", attente: ".rpg-board-page" },
  /* Le sac s'ouvre sur sa première case, une botte de sisal : on choisit une
     gemme légendaire, dont la fiche dit ce qu'elle apporte une fois sertie. */
  {
    cle: "inventaire",
    route: "/inventory",
    attente: ".rpg-plan",
    geste: '.rpg-plan-case:visible',
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
  /* Les quêtes et la guilde montrent deux systèmes actifs dans cette partie
     locale ; la Maison de Maître reste encore à construire. */
  { cle: "quetes", route: "/quests", attente: ".rpg-qj" },
  { cle: "guilde", route: "/guild", attente: ".rpg-board-page" },
];

/** Les trois modes du Marché puis les vues de la salle des Commandes. */
const SALLES = [
  { cle: "acheter", route: "/market", onglet: "ACHETER" },
  { cle: "vendre", route: "/market", onglet: "VENDRE" },
  { cle: "mes-ventes", route: "/market", onglet: "MES VENTES" },
  { cle: "commandes", route: "/commissions", onglet: "OUVERTES" },
  /* Les Commandes ont maintenant leur propre route. */
  { cle: "creer", route: "/commissions", onglet: "CRÉER" },
  { cle: "confier", route: "/commissions", onglet: "CONFIER" },
  { cle: "traitements", route: "/commissions", onglet: "MES TRAITEMENTS" },
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
const HABILLAGE = "nextjs-portal, .rpg-toast-stack, .rpg-heraut, .rpg-banc-etats, .rpg-rappel-validation { display: none !important; }";
const habiller = (page, mobile) => page.addStyleTag({ content: `${HABILLAGE} ${mobile ? "" : ".rpg-topnav { visibility: hidden !important; }"}` });

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
const signer = (sub, email) => {
  const corps = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({
    sub, email, iat: Math.floor(Date.now() / 1000),
  })}`;
  return `${corps}.${createHmac("sha256", SECRET).update(corps).digest("base64url")}`;
};
const modes = process.argv.includes("--desktop-only") ? ["desktop"]
  : process.argv.includes("--mobile-only") ? ["mobile"] : ["desktop", "mobile"];
const erreurs = [];
await mkdir(CIBLE, { recursive: true });
const nav = await chromium.launch();

try {
  for (const mode of modes) {
    const mobile = mode === "mobile";
    const viewport = mobile ? { width: 390, height: 844 } : { width: 1920, height: 1080 };
    const ctx = await nav.newContext({
      viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile,
    });
    await ctx.addCookies([{ name: "rpg_access_token", value: "1", domain: "localhost", path: "/" }]);
    await ctx.addInitScript((t) => localStorage.setItem("rpg_access_token", t), signer(JOUEUR, COURRIEL));
    const pagePrincipale = await ctx.newPage();
    let page = pagePrincipale;
    const ctxVendeur = await nav.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
    await ctxVendeur.addCookies([{ name: "rpg_access_token", value: "1", domain: "localhost", path: "/" }]);
    await ctxVendeur.addInitScript((t) => localStorage.setItem("rpg_access_token", t), signer(VENDEUR, "ostrik@recrue.test"));
    const pageVendeur = await ctxVendeur.newPage();

    async function sauver(nom) {
      await habiller(page, mobile);
      await page.waitForTimeout(900);
      const barre = mobile ? 0 : await page.locator(".rpg-topnav").first()
        .evaluate((el) => Math.round(el.getBoundingClientRect().height)).catch(() => 0);
      const png = await page.screenshot({
        clip: { x: 0, y: barre, width: viewport.width,
          height: mobile && nom.startsWith("conquete-") ? 700 : viewport.height - barre },
        animations: "disabled",
      });
      const suffixe = mobile ? "-mobile" : "";
      await sharp(png).resize({ width: mobile ? 780 : 1920 }).avif({ quality: 70 })
        .toFile(join(CIBLE, `${nom}${suffixe}.avif`));
      if (nom === "marche-acheter") {
        await sharp(png).resize({ width: mobile ? 780 : 2560 }).avif({ quality: 70 })
          .toFile(join(CIBLE, `ouverture-marche${suffixe}.avif`));
      }
      console.log(`${nom}${suffixe}.avif`);
    }

    async function ouvrir(route, attente) {
      await page.goto(`${JEU}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForSelector(attente, { timeout: 20000 });
      await page.waitForTimeout(1400);
    }

    for (const salle of veut("marche") ? SALLES.filter((s) => !SANS.has(s.cle)) : []) {
      page = salle.cle === "mes-ventes" ? pageVendeur : pagePrincipale;
      try {
        await ouvrir(salle.route, ".rpg-mkt");
        if (salle.cle === "mes-ventes") {
          await page.locator(".rpg-fiche-passer").first().click({ timeout: 2000 }).catch(() => {});
        }
        if (salle.cle !== "acheter") {
          await page.locator("button", { hasText: salle.onglet }).first()
            .evaluate((el) => el.click(), { timeout: 8000 });
        }
        await page.waitForTimeout(1000);
        await sauver(`marche-${salle.cle}`);
      } catch (e) {
        erreurs.push(`${mode} marché ${salle.cle}: ${String(e).slice(0, 160)}`);
      }
    }
    page = pagePrincipale;

    for (const salle of veut("galerie") ? SALLES_JEU.filter((s) => !SANS.has(s.cle)) : []) {
      try {
        await ouvrir(salle.route, salle.attente);
        for (const cible of [salle.geste ?? []].flat()) {
          const quoi = typeof cible === "string" ? cible : cible.champ;
          const lieu = page.locator(quoi).first();
          await (typeof cible === "string"
            ? lieu.evaluate((el) => el.click())
            : lieu.fill(cible.texte, { timeout: 4000 }))
            .catch(() => console.log(`  ${salle.cle}: ${quoi} introuvable`));
          await page.waitForTimeout(500);
        }
        await sauver(`jeu-${salle.cle}`);
      } catch (e) {
        erreurs.push(`${mode} galerie ${salle.cle}: ${String(e).slice(0, 160)}`);
      }
    }

    for (const vue of veut("conquete") ? CONQUETE.filter((s) => !SANS.has(s.cle)) : []) {
      try {
        await ouvrir(`/conquete${!mobile && vue.territoire ? `?t=${vue.territoire}` : ""}`, ".rpg-conquete");
        await page.locator(".rpg-banc-etats button", { hasText: vue.banc }).first()
          .evaluate((el) => el.click(), { timeout: 8000 });
        await page.mouse.move(20, viewport.height - 100);
        await sauver(`conquete-${vue.cle}`);
      } catch (e) {
        erreurs.push(`${mode} conquête ${vue.cle}: ${String(e).slice(0, 160)}`);
      }
    }
    await ctx.close();
    await ctxVendeur.close();
  }
} finally {
  await nav.close();
}
if (erreurs.length) {
  console.error(erreurs.join("\n"));
  process.exitCode = 1;
}
