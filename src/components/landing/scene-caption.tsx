import Image from "next/image";
import type { Repere } from "@/lib/landing/types";
import { Reveal } from "./reveal";

/**
 * Le bas de scène : le titre à gauche, ce qu'il faut en savoir à droite.
 *
 * C'est la constante de toute la page. Le regard tombe en bas à gauche parce
 * que c'est là que se termine la lecture d'une image, et le texte se range à
 * droite pour qu'il reste, entre les deux, le vide où l'illustration respire.
 * Un titre centré au milieu de l'écran aurait recouvert le seul endroit qu'on
 * cherche à montrer.
 *
 * La rangée qui ferme la colonne de droite existe en deux formes, et une scène
 * n'en porte qu'une. Les mots seuls — `reperes` — suffisent là où la scène a
 * déjà tout dit. Les emblèmes chiffrés — `chiffres` — ferment les trois scènes
 * qui portent une démonstration dense : sous une rotation de compétences ou un
 * réseau de métiers, une ligne de mots gris ne pèse plus rien, et le regard
 * quitte la page avant d'avoir lu combien il y en a.
 */
export function SceneCaption({
  surtitre,
  titre,
  accent,
  texte,
  reperes,
  chiffres,
  large = false,
}: {
  surtitre: string;
  titre: string;
  accent?: string;
  texte: string;
  reperes?: string[];
  chiffres?: Repere[];
  /** Le titre d'ouverture et celui de clôture, plus grands que les autres. */
  large?: boolean;
}) {
  return (
    <div className="rpg-lp-caption">
      <div>
        <Reveal as="p" className="rpg-lp-kicker">
          {surtitre}
        </Reveal>
        <Reveal delay={100}>
          <h2 className={`rpg-lp-title ${large ? "is-large" : ""}`}>
            {titre}
            {accent ? (
              <>
                <br />
                <span className="rpg-lp-gold">{accent}</span>
              </>
            ) : null}
          </h2>
        </Reveal>
      </div>
      <div>
        <Reveal as="p" delay={200} className="rpg-lp-desc">
          {texte}
        </Reveal>
        {chiffres?.length ? (
          <Reveal delay={300}>
            <ul className="rpg-lp-repere-row">
              {chiffres.map((repere) => (
                <li key={repere.quoi} className={repere.survol ? "is-survol" : undefined}>
                  <span className="rpg-lp-repere-ico">
                    <Image src={repere.art} alt="" fill sizes="28px" className="object-contain" />
                  </span>
                  <span className="rpg-lp-repere-texte">
                    <b>{repere.valeur}</b>
                    <span>{repere.quoi}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
        {reperes?.length ? (
          <Reveal delay={300}>
            <ul className="rpg-lp-meta">
              {reperes.map((repere) => (
                <li key={repere}>{repere}</li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
