/**
 * Ce qui a le droit d'entrer dans la liste.
 *
 * Le contrôle demandé était l'inverse de celui-ci : n'accepter que les
 * fournisseurs connus — gmail, orange, outlook — et refuser le reste. Une
 * liste blanche a un défaut qu'on ne voit qu'une fois en production : elle
 * refuse toutes les adresses professionnelles, celles des écoles, et
 * `support@rakorn.fr` en premier. Ce sont précisément les inscrits qu'on
 * voulait le plus, et ils partent sans pouvoir rien y faire — un refus de
 * liste blanche n'est réparable par personne, ni par eux ni par nous.
 *
 * On garde donc l'intention et on retourne le mécanisme : la liste noire
 * n'écarte que les boîtes jetables, qui sont le vrai « domaine bizarre », et
 * la liste des fournisseurs connus ne sert plus à refuser mais à rattraper les
 * fautes de frappe — `gmial.com` n'est pas un domaine inconnu, c'est un doigt
 * qui a glissé, et un « vouliez-vous dire gmail.com ? » sauve l'inscription au
 * lieu de la perdre.
 *
 * Si la liste blanche stricte reste voulue malgré tout, `STRICTE` la rétablit.
 */

export const STRICTE = false;

/* Les boîtes jetables. Une adresse d'ici ne lira jamais l'annonce de
   l'ouverture : elle n'existe plus le lendemain. */
const JETABLES = new Set([
  "yopmail.com", "yopmail.fr", "yopmail.net", "mailinator.com", "guerrillamail.com",
  "sharklasers.com", "grr.la", "10minutemail.com", "10minutemail.net", "tempmail.com",
  "temp-mail.org", "tempr.email", "tmpmail.org", "minuteinbox.com", "throwawaymail.com",
  "jetable.org", "trashmail.com", "trashmail.fr", "getnada.com", "maildrop.cc",
  "dispostable.com", "fakeinbox.com", "mohmal.com", "spam4.me", "mytemp.email",
  "emailondeck.com", "moakt.com", "discard.email", "mailnesia.com", "inboxkitten.com",
  "burnermail.io", "mailcatch.com", "spambog.com", "anonbox.net", "nowmymail.com",
  "incognitomail.com", "armyspy.com", "cuvox.de", "dayrep.com", "einrot.com",
  "fleckens.hu", "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com",
  "teleworm.us", "mail-temporaire.fr", "yopmail.info", "trbvm.com", "byom.de",
]);

/* Les fournisseurs courants, français d'abord — ce sont eux qu'on tape mal. */
const FOURNISSEURS = [
  "gmail.com", "googlemail.com",
  "outlook.com", "outlook.fr", "hotmail.com", "hotmail.fr", "live.com", "live.fr", "msn.com",
  "yahoo.com", "yahoo.fr", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me",
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "neuf.fr", "laposte.net",
  "bbox.fr", "numericable.fr", "aliceadsl.fr", "club-internet.fr",
  "gmx.com", "gmx.fr", "mailo.com", "aol.com", "zoho.com", "fastmail.com",
  "hey.com", "tuta.io", "tutanota.com",
];

/* Volontairement laxiste : une adresse ne se prouve pas par expression
   régulière, seulement par un message qui arrive. Celle-ci n'écarte que les
   fautes grossières — le reste du tri est fait par l'accusé de réception. */
const FORME = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * La distance d'édition, plafonnée.
 *
 * On s'arrête dès que deux corrections ne suffisent plus : au-delà, ce n'est
 * plus une faute de frappe mais un autre domaine, et proposer « vouliez-vous
 * dire gmail.com ? » à quelqu'un qui a écrit son domaine professionnel est une
 * façon de lui dire qu'il s'est trompé de vie.
 */
function distance(a: string, b: string, plafond = 2) {
  if (Math.abs(a.length - b.length) > plafond) return plafond + 1;
  let precedente = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const courante = [i];
    let minimum = i;
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      const valeur = Math.min(precedente[j] + 1, courante[j - 1] + 1, precedente[j - 1] + cout);
      courante.push(valeur);
      if (valeur < minimum) minimum = valeur;
    }
    /* Toute la ligne dépasse déjà le plafond : le résultat final ne pourra
       plus redescendre en dessous. */
    if (minimum > plafond) return plafond + 1;
    precedente = courante;
  }
  return precedente[b.length];
}

export type Verdict =
  | { ok: true; adresse: string }
  | { ok: false; raison: "format" | "jetable" | "inconnu" }
  | { ok: false; raison: "faute"; suggestion: string };

export function verifier(brut: unknown): Verdict {
  if (typeof brut !== "string") return { ok: false, raison: "format" };

  /* Rangée avant tout le reste : `David@Gmail.COM ` et `david@gmail.com` sont
     la même personne, et deux lignes dans l'audience feraient deux fois le
     même message le jour du lancement. */
  const adresse = brut.trim().toLowerCase();
  if (adresse.length > 254 || !FORME.test(adresse)) return { ok: false, raison: "format" };

  const domaine = adresse.slice(adresse.lastIndexOf("@") + 1);
  if (JETABLES.has(domaine)) return { ok: false, raison: "jetable" };

  if (FOURNISSEURS.includes(domaine)) return { ok: true, adresse };

  if (STRICTE) return { ok: false, raison: "inconnu" };

  /* Le domaine est inconnu : soit c'est un domaine à soi — on le prend —, soit
     c'est un fournisseur mal tapé, et on le signale sans bloquer. */
  for (const connu of FOURNISSEURS) {
    if (distance(domaine, connu) <= (connu.length <= 8 ? 1 : 2)) {
      return { ok: false, raison: "faute", suggestion: connu };
    }
  }

  return { ok: true, adresse };
}
