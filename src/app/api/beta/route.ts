import { Resend } from "resend";
import { verifier } from "@/lib/landing/courriel";

/**
 * L'inscription à la bêta.
 *
 * Deux choses s'y passent, et elles n'ont pas le même poids. Enregistrer
 * l'adresse est la seule qui compte vraiment : c'est la liste, et une adresse
 * perdue l'est pour de bon. Envoyer l'accusé de réception est un confort — le
 * palier gratuit de Resend s'arrête à cent envois par jour, et le jour où on
 * les dépasse, mieux vaut mille fois une inscription sans accusé qu'un
 * visiteur à qui on annonce un échec alors qu'il est bien sur la liste.
 * L'envoi vient donc après l'enregistrement, et son échec ne remonte pas.
 */

/**
 * Le client n'est construit qu'à l'appel.
 *
 * Au build, `RESEND_API_KEY` n'existe pas : un client monté à l'import ferait
 * échouer la compilation d'une page qui, par ailleurs, n'a besoin de rien.
 */
function client() {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) throw new Error("RESEND_API_KEY manquante");
  return new Resend(cle);
}

/**
 * Un frein, et non une serrure.
 *
 * Chaque inscription coûte un envoi sur les cent que le palier gratuit
 * accorde par jour : sans rien, une boucle de trois lignes épuise le quota
 * avant midi. Ce compteur vit dans la mémoire de l'instance — sur un
 * hébergement sans état il y en a autant que d'instances, et il ne prétend
 * donc pas arrêter quelqu'un de déterminé. Il arrête le script distrait, ce
 * qui est le cas fréquent.
 */
const VUES = new Map<string, number[]>();
const FENETRE = 60_000;
const PAR_FENETRE = 5;

function tropSouvent(ip: string) {
  const maintenant = Date.now();
  const recentes = (VUES.get(ip) ?? []).filter((t) => maintenant - t < FENETRE);
  recentes.push(maintenant);
  VUES.set(ip, recentes);
  /* La Map ne se vide jamais d'elle-même : sans ce ménage, une instance de
     longue durée garde une entrée par adresse vue depuis son démarrage. */
  if (VUES.size > 5_000) {
    for (const [cle, dates] of VUES) {
      if (dates.every((t) => maintenant - t >= FENETRE)) VUES.delete(cle);
    }
  }
  return recentes.length > PAR_FENETRE;
}

/**
 * Le segment où atterrissent les inscrits.
 *
 * Resend a remplacé les Audiences par des Segments — `audienceId` existe
 * encore dans le SDK, marqué déprécié, et `resend.audiences` n'est plus qu'un
 * autre nom pour `resend.segments`. On écrit donc contre l'API courante.
 *
 * L'API ne connaît que des identifiants ; le tableau de bord, lui, montre un
 * nom. Plutôt que d'aller chercher l'identifiant au fond d'une URL pour le
 * recopier dans un fichier, on accepte le nom et on le résout au premier
 * appel. Le résultat tient dans une variable de module : un segment ne change
 * pas d'identifiant, et l'instance qui a résolu une fois ne redemande plus.
 */
let resolu: string | undefined;

async function segment(resend: Resend) {
  const direct = process.env.RESEND_SEGMENT_ID;
  if (direct) return direct;
  if (resolu) return resolu;

  const nom = process.env.RESEND_SEGMENT ?? "rakorn-beta";
  const { data, error } = await resend.segments.list();
  if (error) throw new Error(`segments illisibles : ${error.message}`);

  const trouve = data?.data.find((candidat) => candidat.name === nom);
  if (!trouve) {
    const connus = data?.data.map((candidat) => candidat.name).join(", ") || "aucun";
    throw new Error(`pas de segment nommé « ${nom} » — connus : ${connus}`);
  }

  resolu = trouve.id;
  return resolu;
}

function repondre(etat: string, code = 200, suggestion?: string) {
  return Response.json(suggestion ? { etat, suggestion } : { etat }, { status: code });
}

export async function POST(requete: Request) {
  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  if (tropSouvent(ip)) return repondre("erreur", 429);

  let corps: unknown;
  try {
    corps = await requete.json();
  } catch {
    return repondre("invalide", 400);
  }

  const { email, site } = (corps ?? {}) as { email?: unknown; site?: unknown };

  /* Le pot de miel. Le champ est invisible et sans étiquette : un humain ne
     peut pas le remplir, un robot qui remplit tout le remplit. On lui répond
     que c'est enregistré — lui dire qu'il a été repéré, c'est lui apprendre à
     ne plus l'être. */
  if (typeof site === "string" && site.length > 0) return repondre("inscrit");

  /* Le même verdict que celui rendu dans le navigateur, par le même code.
     Celui du navigateur est une politesse — il répond sans attendre le réseau ;
     celui-ci est la vérification, parce qu'une requête n'a pas à passer par la
     page pour arriver ici. */
  const verdict = verifier(email);
  if (!verdict.ok) {
    return repondre(
      verdict.raison,
      400,
      verdict.raison === "faute" ? verdict.suggestion : undefined,
    );
  }
  const adresse = verdict.adresse;

  const resend = client();

  let cible: string;
  try {
    cible = await segment(resend);
  } catch (souci) {
    console.error("[beta] segment introuvable", souci);
    return repondre("erreur", 502);
  }

  /* La question posée avant d'écrire, et non déduite de l'échec de l'écriture.
     Les contacts Resend sont désormais globaux et identifiés par l'adresse :
     une seconde inscription ne crée pas de doublon, mais sans ce contrôle elle
     repartirait quand même avec un accusé de réception — un message de plus
     dans une boîte qui n'a rien demandé, et un envoi de moins sur les cent que
     la journée accorde. */
  const { data: connu } = await resend.contacts.get({ email: adresse });
  if (connu) return repondre("deja");

  const { error } = await resend.contacts.create({
    email: adresse,
    segments: [{ id: cible }],
    /* Explicite, et à vérifier une fois dans le tableau de bord : un contact
       créé « unsubscribed » est invisible pour les Broadcasts. Une liste
       entière dans cet état ne se voit que le jour du lancement, quand le
       message ne part à personne. */
    unsubscribed: false,
  });

  if (error) {
    /* Le second filet, pour les deux inscriptions parties en même temps : la
       lecture ci-dessus ne les a vues ni l'une ni l'autre, et c'est la seconde
       écriture qui l'apprend. Resend ne documente pas de code pour ce cas, la
       forme du message est tout ce qu'on a — mais on n'en dépend plus que pour
       une course, jamais pour la réinscription ordinaire. */
    if (/exist|duplicate|already/i.test(error.message ?? "")) return repondre("deja");
    console.error("[beta] contact non créé", error);
    return repondre("erreur", 502);
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: adresse,
      replyTo: process.env.RESEND_REPLY_TO || undefined,
      subject: "Votre place dans la bêta de Rakorn",
      text: ACCUSE_TEXTE,
      html: ACCUSE_HTML,
    });
  } catch (souci) {
    /* Le quota du jour, une coupure, un domaine pas encore vérifié : rien de
       tout cela ne défait l'inscription, qui est déjà faite. */
    console.error("[beta] accusé non envoyé", souci);
  }

  return repondre("inscrit");
}

const ACCUSE_TEXTE = `Votre adresse est sur la liste.

Rakorn est un jeu de rôle d'artisanat et de commerce qui se joue dans le
navigateur. Vous serez prévenu dès que la bêta ouvrira — un seul message,
et rien d'autre d'ici là.

À bientôt dans la vallée.`;

/* Une table, des styles en ligne, aucune police distante : ce sont les trois
   contraintes des clients de messagerie, et Gmail en ignore la moitié si on
   les néglige. Le message tient en deux paragraphes — il n'a rien à vendre,
   la personne vient de dire oui. */
const ACCUSE_HTML = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050c0f;padding:40px 16px;font-family:Georgia,'Times New Roman',serif">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
      <tr><td style="color:#d9a441;font-size:12px;letter-spacing:.18em;text-transform:uppercase;padding-bottom:18px">Rakorn</td></tr>
      <tr><td style="color:#f6d989;font-size:26px;line-height:1.3;padding-bottom:18px">Votre adresse est sur la liste.</td></tr>
      <tr><td style="color:#f3e2b3;font-size:15px;line-height:1.7;padding-bottom:14px">Rakorn est un jeu de rôle d'artisanat et de commerce qui se joue dans le navigateur. Vous serez prévenu dès que la bêta ouvrira.</td></tr>
      <tr><td style="color:rgba(243,226,179,.62);font-size:15px;line-height:1.7">Un seul message, et rien d'autre d'ici là. À bientôt dans la vallée.</td></tr>
    </table>
  </td></tr>
</table>`;
