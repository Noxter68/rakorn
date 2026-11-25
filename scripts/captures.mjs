/**
 * Photographie le jeu pour la vitrine : le Marché, les Commandes, les
 * douze pages de la galerie d'aperçu et la carte de la conquête, en bureau
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
 * Depuis Rakorn 2.0, chaque salle est une fenêtre de l'accueil : la prise de
 * bureau est cadrée sur elle, celle du téléphone garde l'écran entier.
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
  /* Rakorn 2.0 (novembre 2026) : les pages sont devenues des fenêtres posées
     sur l'accueil, et leur adresse est `/home?fenetre=…`. Les anciennes routes
     y redirigent encore ; on vise la fenêtre directement, et on attend son
     corps plutôt qu'une classe de salle qui change à chaque refonte. */
  /* Le Forgeron, toutes recettes, sur une pièce légendaire de fin de métier :
     la liste reste pleine autour d'elle, et sa fiche a de quoi montrer. */
  {
    cle: "metiers",
    route: "/home?fenetre=metiers",
    attente: ".rpg-met",
    geste: [
      '.rpg-met-onglet:has-text("Forgeron")',
      '.rpg-met button:text-is("Toutes")',
      /* Au bas d'une longue liste : on l'amène au milieu avant de la prendre. */
      { clic: '.rpg-met-row:has-text("Bouclier du Roi sous la Montagne")', defiler: true },
    ],
  },
  /* La recherche du Serment peuple la liste et ouvre la première pièce. */
  {
    cle: "codex",
    route: "/home?fenetre=codex",
    attente: ".rpg-fenetre-corps input",
    geste: [
      { champ: "input[placeholder^='Rechercher']", texte: "Serment" },
    ],
  },
  { cle: "contrats", route: "/home?fenetre=contrats", attente: ".rpg-fenetre-corps" },
  /* Les compétences vivent dans la fenêtre du héros, onglet Ordre de bataille. */
  { cle: "competences", route: "/home?fenetre=competences", attente: ".rpg-fenetre-corps" },
  { cle: "personnage", route: "/home?fenetre=heros", attente: ".rpg-fenetre-corps" },
  /* Le sac s'ouvre sur sa première case. */
  {
    cle: "inventaire",
    route: "/home?fenetre=inventaire",
    attente: ".rpg-fenetre-corps",
    geste: '.rpg-plan-case:visible',
  },
  /* La campagne a retrouvé sa page : elle n'est pas une fenêtre. */
  { cle: "campagne", route: "/map", attente: ".rpg-camp-card, .rpg-campaign-strip" },
  /* La Forge s'ouvre sur une amulette commune « déjà en parfait état » : un
     établi qui n'a rien à faire. On prend une pièce légendaire usée aux
     cinq sixièmes, et le geste de réparer a de quoi se montrer. */
  {
    cle: "forge",
    route: "/home?fenetre=forge",
    attente: ".rpg-fenetre-corps",
    geste: '.rpg-plan-case[aria-label^="Bouclier du Roi sous la Montagne"]',
  },
  { cle: "quetes", route: "/home?fenetre=quetes", attente: ".rpg-lq" },
  /* La Maison de Maître : Dorn l'a bâtie entière, ses trois salles et le
     comptoir des Maîtres s'y montrent. Les hauts faits s'ouvrent sur leur
     résumé, les derniers obtenus et le compte sur mille trois cent
     soixante-douze ; leur voile se pose en fondu, d'où l'attente. */
  { cle: "maison", route: "/home?fenetre=maison", attente: ".rpg-fenetre-corps", pause: 1500 },
  { cle: "hauts-faits", route: "/home?fenetre=hauts-faits", attente: ".rpg-fenetre-corps", pause: 2500 },
  { cle: "guilde", route: "/home?fenetre=guilde", attente: ".rpg-fenetre-corps" },
];

/** Les trois modes du Marché puis les vues de la salle des Commandes. */
const SALLES = [
  { cle: "acheter", route: "/home?fenetre=marche", onglet: "ACHETER" },
  { cle: "vendre", route: "/home?fenetre=marche", onglet: "VENDRE" },
  { cle: "mes-ventes", route: "/home?fenetre=marche", onglet: "MES VENTES" },
  { cle: "commandes", route: "/home?fenetre=commandes", onglet: "OUVERTES" },
  { cle: "creer", route: "/home?fenetre=commandes", onglet: "CRÉER" },
  { cle: "confier", route: "/home?fenetre=commandes", onglet: "CONFIER" },
  { cle: "traitements", route: "/home?fenetre=commandes", onglet: "MES TRAITEMENTS" },
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
/* Depuis le 18 novembre 2026, la Conquête n'est plus une page mais la
   fenêtre « conquete » : la carte du monde et ses cent douze territoires au
   bureau, une liste de zones au doigt. Le banc d'essai est devenu un panneau
   flottant à rayons ; son rayon « Conquête » pose les scénarios ci-dessous.
   Au bureau, `territoire` ouvre la fiche d'un lieu par `__ouvrirLeTiroir`
   (hors production).

   Au doigt, la liste ne lit pas le banc : elle dit toujours l'état réel, et
   trois scénarios y donnaient trois fois la même image. Les vues y viennent
   donc de ce que la partie locale tient vraiment — `mobile` dit ce qu'on
   touche : rien (les zones), `"zone"` (la première zone ouverte déplie ses
   territoires), ou le sélecteur d'un territoire dont la fiche monte du bas. */
const CONQUETE = [
  { cle: "royaume", banc: "Tout à la fois", territoire: "rakorn", mobile: null },
  { cle: "solo", banc: "Réel", territoire: "campaign_1/1", mobile: "zone" },
  { cle: "guilde", banc: "Carte prise", mobile: ".rpg-cqd-territoire.is-nous" },
  { cle: "siege", banc: "Conflits", mobile: ".rpg-cqd-territoire.is-conflit" },
  { cle: "bonus", banc: "Réel", territoire: "campaign_5/2", mobile: ".rpg-cqd-territoire.is-autres" },
];
const ZONE_OUVERTE = ".rpg-cqd-zone:not(.is-fermee):not(.is-capitale)";

/**
 * Ce qu'on retire de chaque prise, sans rien déplacer : les notifications,
 * les bancs d'essai, le rappel d'adresse à valider et l'indicateur de Next,
 * qui n'existent pas pour un joueur. Au bureau, la croix de la fenêtre part
 * aussi : la prise est cadrée sur la fenêtre, et la croix n'y dirait rien.
 */
const HABILLAGE = "nextjs-portal, .rpg-toast-stack, .rpg-heraut, .rpg-banc-etats, .rpg-rappel-validation, .rpg-banc-glisse, [data-banc], .rpg-bench, .rpg-bench-bascule, .rpg-bench-flottant, .rpg-fl-banc, .rpg-seuil-outils, .rpg-grande-pro { display: none !important; }";
const habiller = (page, mobile) => page.addStyleTag({ content: `${HABILLAGE} ${mobile ? "" : ".rpg-fenetre-croix, .rpg-topnav { visibility: hidden !important; }"}` });

/** Referme ce qui n'est pas l'écran montré : une présentation, une visite guidée. */
async function degager(page) {
  /* Les proclamations non lues se suivent : une croix en découvre une autre. */
  for (let i = 0; i < 15; i++) {
    const fait = await page.evaluate(() => {
      /* La grande annonce d'une proclamation pas encore lue, puis la
         présentation et la visite d'un compte qui découvre l'accueil. */
      const b = document.querySelector(".rpg-grande-pro-croix") ?? [...document.querySelectorAll("button, a")]
        .find((x) => /^(passer|je découvrirai seul)$/i.test(x.textContent.trim()));
      b?.click();
      return !!b;
    });
    if (!fait) break;
    await page.waitForTimeout(600);
  }
}

/** Pose un scénario de la Conquête par le banc d'essai, puis le referme. */
async function poserScenario(page, nom) {
  await page.evaluate(async (nom) => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector(".rpg-bench-bascule")?.click();
    await pause(400);
    [...document.querySelectorAll(".rpg-bench-rayon")].find((b) => b.textContent.includes("Conquête"))?.click();
    await pause(400);
    const bouton = [...document.querySelectorAll(".rpg-bench-btn")].find((b) => b.querySelector("b")?.textContent.trim() === nom);
    if (!bouton) throw new Error(`scénario « ${nom} » introuvable au banc`);
    bouton.click();
    await pause(300);
    document.querySelector(".rpg-bench-fermer")?.click();
  }, nom);
}

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

    /**
     * Au bureau, la prise est cadrée sur la fenêtre : derrière elle, l'accueil
     * assombri et la barre du bas, avec leurs pastilles du moment, ne disent
     * rien de l'écran montré. Une page qui n'est pas une fenêtre (la campagne)
     * garde tout l'écran sous la barre du haut. Au doigt, on garde le
     * téléphone entier, tel que le joueur le tient.
     */
    async function cadre() {
      if (mobile) return { x: 0, y: 0, width: viewport.width, height: viewport.height };
      const fenetre = await page.locator(".rpg-fenetre").first().boundingBox({ timeout: 1000 }).catch(() => null);
      if (fenetre) {
        const x = Math.round(fenetre.x), y = Math.round(fenetre.y);
        return { x, y, width: Math.round(fenetre.width), height: Math.round(fenetre.height) };
      }
      const barre = await page.locator(".rpg-topnav").first()
        .evaluate((el) => Math.round(el.getBoundingClientRect().height)).catch(() => 0);
      return { x: 0, y: barre, width: viewport.width, height: viewport.height - barre };
    }

    async function sauver(nom) {
      await habiller(page, mobile);
      await page.mouse.move(viewport.width / 2, 2);
      /* Les vignettes d'une liste qu'un geste vient de remplir arrivent après
         elle : on attend que le réseau se taise, sans en faire une condition. */
      await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(900);
      const png = await page.screenshot({ clip: await cadre(), animations: "disabled" });
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
      /* Un compte qui n'a pas encore vu l'accueil reçoit sa présentation
         (« Bienvenue à Rakorn ») avant toute fenêtre : on la passe. */
      await page.waitForTimeout(1500);
      await degager(page);
      if (!page.url().includes(route.split("?")[1] ?? route)) {
        await page.goto(`${JEU}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      }
      await page.waitForSelector(attente, { timeout: 20000 });
      await page.waitForTimeout(1400);
      await degager(page);
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
        if (salle.pause) await page.waitForTimeout(salle.pause);
        for (const cible of [salle.geste ?? []].flat()) {
          const quoi = typeof cible === "string" ? cible : (cible.clic ?? cible.champ);
          const lieu = page.locator(quoi).first();
          await (cible.champ
            ? lieu.fill(cible.texte, { timeout: 4000 })
            : lieu.evaluate((el, defiler) => {
              if (defiler) el.scrollIntoView({ block: "center" });
              el.click();
            }, !!cible.defiler))
            .catch(() => console.log(`  ${salle.cle}: ${quoi} introuvable`));
          await page.waitForTimeout(500);
        }
        await sauver(`jeu-${salle.cle}`);
      } catch (e) {
        erreurs.push(`${mode} galerie ${salle.cle}: ${String(e).slice(0, 160)}`);
      }
    }

    /* La visite de la Conquête s'ouvre à la première fiche d'une session, et
       déplace la carte pour la montrer. On l'épuise d'abord, hors prise : les
       cinq vues gardent ainsi le même cadrage au pixel. */
    if (veut("conquete") && !mobile) {
      try {
        await ouvrir("/home?fenetre=conquete", ".rpg-cq-bandeau");
        await page.evaluate(() => window.__ouvrirLeTiroir?.({ nature: "territoire", cle: "rakorn" }));
        await page.locator(".rpg-gdc-croix").click({ timeout: 6000 });
        await page.waitForTimeout(800);
      } catch {
        console.log("  conquête : pas de visite à refermer");
      }
    }

    for (const vue of veut("conquete") ? CONQUETE.filter((s) => !SANS.has(s.cle)) : []) {
      try {
        await ouvrir("/home?fenetre=conquete", mobile ? ".rpg-cqd-zone" : ".rpg-cq-bandeau");
        await page.waitForTimeout(1500);
        await poserScenario(page, vue.banc);
        await page.waitForTimeout(800);
        if (!mobile && vue.territoire) {
          await page.evaluate((cle) => window.__ouvrirLeTiroir?.({ nature: "territoire", cle }), vue.territoire);
          await page.waitForTimeout(1500);
          /* La visite de la conquête s'ouvre à la première fiche : on la referme. */
          await page.locator(".rpg-gdc-croix").click({ timeout: 1500 }).catch(() => {});
        }
        if (mobile && vue.mobile) {
          await page.locator(ZONE_OUVERTE).first().tap();
          await page.waitForTimeout(1200);
          if (vue.mobile !== "zone") {
            await page.locator(vue.mobile).first().tap();
            await page.waitForTimeout(1500);
            await page.locator(".rpg-gdc-croix").click({ timeout: 1500 }).catch(() => {});
          }
        }
        /* La carte arrive par tuiles : une tuile en retard laisse une bande
           noire au bas de la prise. On attend qu'elles soient toutes là. */
        if (!mobile) {
          await page.waitForFunction(() => {
            /* Les tuiles, mais aussi les peintures de zone posées en calques
               d'image : l'une d'elles en retard laissait un pavé noir. */
            const tuiles = [...document.querySelectorAll(".rpg-fenetre .leaflet-tile")];
            const images = [...document.querySelectorAll(".rpg-fenetre .leaflet-pane img")];
            return tuiles.length > 0
              && tuiles.every((t) => t.classList.contains("leaflet-tile-loaded"))
              && images.every((i) => i.complete && i.naturalWidth > 0);
          }, null, { timeout: 15000 }).catch(() => console.log(`  conquête ${vue.cle} : tuiles incomplètes`));
        }
        /* Chargées, les tuiles et le brouillard finissent encore leur fondu :
           pris trop tôt, on en voit les coutures. */
        await page.waitForTimeout(3000);
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
