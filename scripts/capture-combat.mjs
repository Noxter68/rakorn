/** Capture une vraie arène de campagne pour le carrousel d'ouverture.
 * Une mission de la partie locale est lancée puis annulée en sortie. Le jeu
 * débite son coût de 5 points d'énergie, même si le combat est abandonné. */
import { createHmac } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";

const cible = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "captures");
const jeu = process.env.JEU_URL ?? "http://localhost:3000";
const api = process.env.API_URL ?? "http://localhost:3001";
const secret = process.env.JWT_SECRET ?? "change-me-in-production";
const sub = process.env.CAPTURE_SUB ?? "258e3625-e8ad-4ca9-a6d9-db2952567ce9";
const email = process.env.CAPTURE_EMAIL ?? "dorn@recrue.test";
const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const corps = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({
  sub, email, iat: Math.floor(Date.now() / 1000),
})}`;
const jeton = `${corps}.${createHmac("sha256", secret).update(corps).digest("base64url")}`;
const nav = await chromium.launch();
let missionId;

async function contexte(viewport, mobile) {
  const ctx = await nav.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await ctx.addCookies([{ name: "rpg_access_token", value: "1", domain: "localhost", path: "/" }]);
  await ctx.addInitScript((token) => localStorage.setItem("rpg_access_token", token), jeton);
  return ctx;
}

async function sauver(page, nom, largeur) {
  await page.waitForSelector(".rpg-cbt", { timeout: 20000 });
  await page.addStyleTag({ content: "nextjs-portal, .rpg-heraut, .rpg-toast-stack, .rpg-rappel-validation { display: none !important; }" });
  await page.waitForTimeout(700);
  const png = await page.screenshot({ animations: "disabled" });
  await sharp(png).resize({ width: largeur }).avif({ quality: 72 }).toFile(join(cible, nom));
  console.log(nom);
}

try {
  const bureau = await contexte({ width: 1920, height: 1080 }, false);
  const page = await bureau.newPage();
  await page.goto(`${jeu}/map`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Continuer l.expédition/ }).first().click({ timeout: 20000 });
  await page.getByRole("button", { name: "Combattre", exact: true }).click({ timeout: 10000 });
  await page.waitForURL(/\/map\/fight\/[a-f0-9-]+/, { timeout: 20000 });
  missionId = page.url().match(/\/map\/fight\/([a-f0-9-]+)/)?.[1];
  await sauver(page, "ouverture-combat.avif", 1920);

  const paysage = await contexte({ width: 844, height: 390 }, true);
  const mobilePage = await paysage.newPage();
  await mobilePage.goto(`${jeu}/map/fight/${missionId}`, { waitUntil: "domcontentloaded" });
  await sauver(mobilePage, "ouverture-combat-mobile.avif", 1688);
  await paysage.close();
  await bureau.close();
} finally {
  if (missionId) {
    const resultat = await fetch(`${api}/campaign/missions/${missionId}/cancel`, {
      method: "POST", headers: { Authorization: `Bearer ${jeton}` },
    });
    if (!resultat.ok) console.error(`Annulation de la mission ${missionId} : HTTP ${resultat.status}`);
  }
  await nav.close();
}
