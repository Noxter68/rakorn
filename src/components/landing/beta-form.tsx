"use client";

import { useRef, useState } from "react";
import { BETA } from "@/lib/landing/page";
import { verifier } from "@/lib/landing/courriel";
import { mesurer } from "@/lib/landing/mesure";

/**
 * Le seul endroit de la page où l'on demande quelque chose.
 *
 * Un champ, et rien d'autre : pas de nom, pas de case à cocher, pas de
 * confirmation d'adresse. Chaque champ ajouté ici se paie en inscriptions
 * perdues, et aucun des trois ne servirait avant le jour de l'ouverture.
 *
 * L'adresse est vérifiée deux fois, par le même code — voir `courriel.ts`.
 * Ici pour répondre sans attendre le réseau ; sur le serveur parce qu'une
 * vérification faite dans le navigateur n'est pas une vérification, seulement
 * une politesse.
 */

type Etat =
  | "repos"
  | "envoi"
  | "inscrit"
  | "deja"
  | "format"
  | "jetable"
  | "inconnu"
  | "faute"
  | "erreur";

const MESSAGES: Record<Exclude<Etat, "repos" | "envoi" | "faute">, string> = {
  inscrit: "C'est noté. Votre adresse est sur la liste d'attente.",
  deja: "Votre adresse y était déjà — vous ne serez pas prévenu deux fois.",
  format: "Cette adresse ne ressemble pas encore à une adresse.",
  jetable: "Une boîte jetable n'existera plus le jour de l'ouverture.",
  inconnu: "Ce fournisseur n'est pas accepté.",
  erreur: "L'inscription n'a pas abouti. Réessayez dans un instant.",
};

const ECHECS: Etat[] = ["format", "jetable", "inconnu", "faute", "erreur"];

export function BetaForm() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<Etat>("repos");
  const [suggestion, setSuggestion] = useState("");
  const champ = useRef<HTMLInputElement>(null);

  const fini = etat === "inscrit" || etat === "deja";
  const echoue = ECHECS.includes(etat);

  /** Remplace le domaine par celui qu'on propose, sans renvoyer : la
   *  correction est offerte, elle n'est pas imposée. */
  function corriger() {
    const coupure = email.lastIndexOf("@");
    if (coupure < 0) return;
    setEmail(`${email.slice(0, coupure + 1)}${suggestion}`);
    setEtat("repos");
    champ.current?.focus();
  }

  async function envoyer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    if (etat === "envoi") return;

    /* Le même verdict que celui du serveur, rendu sans aller-retour : une
       faute de frappe se signale au dixième de seconde, pas au bout d'un
       aller-retour réseau. */
    const verdict = verifier(email);
    if (!verdict.ok) {
      setEtat(verdict.raison);
      if (verdict.raison === "faute") setSuggestion(verdict.suggestion);
      return;
    }

    setEtat("envoi");
    const donnees = new FormData(evenement.currentTarget);

    try {
      const reponse = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: verdict.adresse, site: donnees.get("site") }),
      });
      const retour = (await reponse.json()) as { etat?: Etat; suggestion?: string };
      if (retour.suggestion) setSuggestion(retour.suggestion);
      setEtat(retour.etat ?? "erreur");
      /* Seulement la première inscription : compter aussi celui qui se
         réinscrit gonflerait le seul chiffre qu'on regardera. */
      if (retour.etat === "inscrit") mesurer("beta_inscription");
    } catch {
      /* Hors ligne, ou la requête n'est jamais partie. Le message est le même :
         la personne n'a que faire de savoir lequel des deux. */
      setEtat("erreur");
    }
  }

  if (fini) {
    return (
      <p className="rpg-lp-beta-fait" role="status">
        {MESSAGES[etat]}
      </p>
    );
  }

  return (
    <form className="rpg-lp-beta" onSubmit={envoyer} noValidate>
      <div className="rpg-lp-beta-ligne">
        <input
          ref={champ}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            /* L'erreur s'efface dès qu'on corrige : la laisser sous un champ
               qu'on est en train de réécrire, c'est reprocher une faute déjà
               en train d'être réparée. */
            if (etat !== "repos") setEtat("repos");
          }}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="vous@exemple.fr"
          aria-label="Votre adresse e-mail"
          aria-invalid={echoue}
          disabled={etat === "envoi"}
          className="rpg-lp-beta-champ"
        />

        {/* Le pot de miel : hors du parcours au clavier, muet pour les lecteurs
            d'écran, invisible à l'œil. Seul un robot le remplit. */}
        <input
          type="text"
          name="site"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="rpg-lp-beta-piege"
        />

        <button type="submit" className="rpg-lp-btn" disabled={etat === "envoi"}>
          {etat === "envoi" ? "Envoi…" : BETA.action}
        </button>
      </div>

      {/* La hauteur est réservée en permanence : sans elle, la ligne apparaît
          au premier échec et pousse le bouton sous le doigt qui vient de
          cliquer — qui clique donc une seconde fois, sur autre chose. */}
      <p className="rpg-lp-beta-etat" data-etat={etat} role="status" aria-live="polite">
        {etat === "faute" ? (
          <>
            Vouliez-vous dire{" "}
            <button type="button" className="rpg-lp-beta-corriger" onClick={corriger}>
              {suggestion}
            </button>
            {" ?"}
          </>
        ) : echoue ? (
          MESSAGES[etat as Exclude<Etat, "repos" | "envoi" | "faute">]
        ) : (
          BETA.mention
        )}
      </p>
    </form>
  );
}
