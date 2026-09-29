import Image from "next/image";
import { Fragment } from "react";
import type { EtapeForge, PieceForge, Poste } from "@/lib/landing/equipement";
import { FICHES } from "@/lib/landing/fiches";
import { ItemFiche } from "./item-fiche";

/**
 * Ce qu'un onglet de la forge montre, selon ce qu'il a à dire.
 *
 * Quatre formes pour quatre natures. L'**atelier** — le premier onglet — pose
 * trois postes, la mine, l'établi, la forge, et ce qui passe de l'un à
 * l'autre : c'est la seule disposition qui fasse comprendre qu'une armure
 * *vient* d'un filon. La **chaîne** étale les quatre pièces d'une panoplie,
 * numérotées. Les **traitements** n'ont pas de fiche d'objet — ce sont des
 * recherches de Maître —, ils portent donc leurs chiffres en clair et
 * s'étalent en rangée. Les **gemmes** gardent la liste, et la colonne de
 * droite dit ce qu'est une châsse tant qu'on ne survole aucune pierre.
 *
 * **La fiche vit dans la colonne de droite de la scène**, pas dans la
 * surimpression : elle y prend toute la hauteur et peut donc grandir. Elle
 * montre une pièce posée, et survoler n'importe quelle autre y met la sienne à
 * la place. Rien de tout cela n'est en JavaScript : les fiches sont rendues par
 * le serveur, empilées au même endroit, et `:has()` décide laquelle se voit.
 * Un état React aurait fait de tout ce contenu du code client pour un résultat
 * qui ne change jamais après le premier rendu.
 */
export function ForgeOverlay({ etape }: { etape: EtapeForge }) {
  /* Une liste qui ouvre des fiches doit leur laisser une colonne : posée
     par-dessus, la fiche recouvrirait justement la case qu'on survole. */
  const aFiche = !!etape.pieces || !!etape.postes || !!etape.gemmes;

  return (
    <div
      className={`rpg-lp-forge is-${etape.disposition ?? "colonne"}`}
      data-fiche={aFiche ? "" : undefined}
    >
      {/* L'explication tient la colonne de droite tant qu'aucune pierre n'est
          survolée : l'une n'est utile que tant que l'autre dort. */}
      {etape.explication ? (
        <div className="rpg-lp-explique rpg-lp-colonne-fiche is-defaut">
          <div className="rpg-lp-explique-corps">
            <h3>{etape.explication.titre}</h3>
            {etape.explication.texte.map((phrase) => (
              <p key={phrase.slice(0, 24)}>{phrase}</p>
            ))}
          </div>
        </div>
      ) : null}

      {etape.postes ? (
        <Atelier postes={etape.postes} passages={etape.passages} />
      ) : null}

      {etape.pieces ? <Chaine pieces={etape.pieces} /> : null}

      {etape.apercus?.length ? (
        <div className="rpg-lp-suite">
          <p className="rpg-lp-suite-titre">Et la pièce n&apos;est pas finie</p>
          <ul className="rpg-lp-apercus">
            {etape.apercus.map((apercu) => (
              <li key={apercu.titre}>
                <span className="rpg-lp-apercu-art">
                  <Image src={apercu.art} alt="" fill sizes="52px" className="object-contain" />
                </span>
                <span className="rpg-lp-apercu-texte">
                  <span className="rpg-lp-apercu-titre">{apercu.titre}</span>
                  <b>{apercu.nom}</b>
                  <span className="rpg-lp-apercu-gain">{apercu.gain}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {etape.traitements ? (
        <ul className="rpg-lp-fiches is-rangee">
          {etape.traitements.map((traitement) => (
            <li key={traitement.art} className="rpg-lp-fiche">
              <span className="rpg-lp-fiche-art">
                <Image src={traitement.art} alt="" fill sizes="140px" className="object-contain" />
              </span>
              <span className="rpg-lp-fiche-texte">
                <b className="rpg-lp-fiche-nom is-epic">{traitement.nom}</b>
                <span className="rpg-lp-fiche-gain">{traitement.gain}</span>
                <span className="rpg-lp-fiche-role">
                  {traitement.piece} · {traitement.rangs}
                </span>
                <span className="rpg-lp-fiche-recit">{traitement.texte}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {etape.gemmes ? (
        <ul className="rpg-lp-fiches">
          {etape.gemmes.map((gemme) => (
            <li key={gemme.art} className="rpg-lp-fiche has-tip" tabIndex={0}>
              <span className="rpg-lp-fiche-art">
                <Image src={gemme.art} alt="" fill sizes="96px" className="object-contain" />
              </span>
              <span className="rpg-lp-fiche-texte">
                <b className="rpg-lp-fiche-nom is-legendary">{gemme.nom}</b>
                <span className="rpg-lp-fiche-gain">{gemme.parRang}</span>
                {/* Les cinq crans, en losanges : c'est la seule façon de faire
                    voir qu'une pierre monte, sans écrire cinq lignes. */}
                <span className="rpg-lp-rangs">
                  {[1, 2, 3, 4, 5].map((rang) => (
                    <i key={rang} aria-hidden />
                  ))}
                  <em>
                    rang V — {gemme.auRangCinq} · accord {gemme.harmonie}
                  </em>
                </span>
              </span>
              <span className="rpg-lp-colonne-fiche is-survol" aria-hidden>
                <ItemFiche fiche={FICHES[gemme.fiche]} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {etape.pieces || etape.postes ? (
        <span className="rpg-lp-colonne-fiche is-defaut" aria-hidden>
          <ItemFiche fiche={FICHES[ficheParDefaut(etape)]} />
        </span>
      ) : null}
    </div>
  );
}

/** La fiche posée tant qu'on ne survole rien : celle que l'onglet nomme, sinon la dernière pièce. */
function ficheParDefaut(etape: EtapeForge): string {
  if (etape.defaut) return etape.defaut;
  const pieces = etape.pieces ?? etape.postes?.flatMap((poste) => poste.pieces) ?? [];
  return pieces[pieces.length - 1].fiche;
}

/**
 * Une pièce qu'on survole pour sa fiche.
 *
 * La case n'est **pas** positionnée, et c'est délibéré : la fiche qu'elle
 * contient se cale alors sur la scène et non sur les cent cinquante pixels de
 * sa case, ce qui lui permet d'occuper la colonne de droite.
 */
function CasePiece({
  piece,
  numero,
  classe,
}: {
  piece: PieceForge;
  numero?: string;
  classe: string;
}) {
  return (
    <li className={`${classe}-case has-tip`} tabIndex={0}>
      {numero ? <span className={`${classe}-num`}>{numero}</span> : null}
      <span className={`${classe}-art`}>
        <Image
          src={piece.art}
          alt=""
          fill
          sizes="(min-width: 1400px) 208px, 14vw"
          className="object-contain"
        />
      </span>
      <b className={`${classe}-nom is-${piece.rarete}`}>{piece.nom}</b>
      <span className={`${classe}-role`}>{piece.role}</span>
      <span className="rpg-lp-colonne-fiche is-survol" aria-hidden>
        <ItemFiche fiche={FICHES[piece.fiche]} />
      </span>
    </li>
  );
}

/**
 * La mine, l'établi, la forge — et ce qui passe de l'un à l'autre.
 *
 * Chaque poste porte un verbe, un lieu et ce qui en sort ; entre deux, une
 * flèche et la recette qui les relie, en quantités. C'est le chiffre qui fait
 * comprendre qu'on *transforme* : « cinq fers par lingot » dit en quatre mots
 * ce que quatre illustrations côte à côte ne disaient pas.
 *
 * L'enclume est derrière le dernier poste, assourdie : elle dit de quel
 * atelier il s'agit sans disputer la lecture des pièces.
 */
function Atelier({ postes, passages }: { postes: Poste[]; passages?: string[] }) {
  return (
    <ol className="rpg-lp-atelier">
      {postes.map((poste, i) => (
        <Fragment key={poste.verbe}>
          {i > 0 ? (
            <li className="rpg-lp-passage" aria-hidden>
              <span className="rpg-lp-passage-fleche" />
              {passages?.[i - 1] ? (
                <span className="rpg-lp-passage-texte">{passages[i - 1]}</span>
              ) : null}
            </li>
          ) : null}
          <li className={`rpg-lp-poste ${i === postes.length - 1 ? "is-dernier" : ""}`}>
            {i === postes.length - 1 ? (
              <span className="rpg-lp-poste-enclume" aria-hidden>
                <Image
                  src="/game/profession/forge-work.avif"
                  alt=""
                  fill
                  sizes="(min-width: 1400px) 420px, 30vw"
                  className="object-contain"
                />
              </span>
            ) : null}
            <span className="rpg-lp-poste-tete">
              <span className="rpg-lp-poste-num">{String(i + 1).padStart(2, "0")}</span>
              <b className="rpg-lp-poste-verbe">{poste.verbe}</b>
              <span className="rpg-lp-poste-lieu">{poste.lieu}</span>
            </span>
            <ul className="rpg-lp-poste-pieces">
              {poste.pieces.map((piece) => (
                <CasePiece key={piece.fiche} piece={piece} classe="rpg-lp-poste" />
              ))}
            </ul>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}

/** Les quatre pièces d'une panoplie, numérotées et enchaînées. */
function Chaine({ pieces }: { pieces: PieceForge[] }) {
  return (
    <ol className="rpg-lp-chaine">
      {pieces.map((piece, i) => (
        <CasePiece
          key={piece.art}
          piece={piece}
          numero={`0${i + 1}`}
          classe="rpg-lp-chaine"
        />
      ))}
    </ol>
  );
}
