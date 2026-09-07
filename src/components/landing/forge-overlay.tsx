import Image from "next/image";
import type { EtapeForge, PieceForge } from "@/lib/landing/equipement";
import { FICHES } from "@/lib/landing/fiches";
import { ItemFiche } from "./item-fiche";

/**
 * Ce qu'un onglet de la forge montre, selon ce qu'il a à dire.
 *
 * Trois formes pour trois natures. Les **pièces** s'enchaînent : numérotées,
 * séparées de chevrons, elles vont de la matière à la pièce finie, et la
 * dernière est celle que la fiche détaille. C'est la seule disposition qui
 * fasse voir qu'une pièce *vient* de la précédente — quatre illustrations
 * alignées à égalité disaient « en voici quatre », pas « voici comment on y
 * arrive ». Les **traitements** n'ont pas de fiche d'objet — ce sont des
 * recherches de Maître —, ils portent donc leurs chiffres en clair et
 * s'étalent en rangée puisqu'ils n'ont rien à ouvrir sur le côté. Les
 * **gemmes** gardent la colonne, et la place laissée libre sert à dire ce
 * qu'est une châsse : on y lisait « +160 Vie » sans savoir où cela se pose.
 *
 * **La fiche est posée, et le survol la remplace.** Elle montre la dernière
 * pièce de la chaîne — celle qu'on a fabriquée —, et survoler n'importe
 * laquelle des quatre y met la sienne à la place. Rien de tout cela n'est en
 * JavaScript : les cinq fiches sont rendues par le serveur, empilées au même
 * endroit, et `:has()` décide laquelle se voit. Un état React aurait fait de
 * tout ce contenu du code client pour un résultat qui ne change jamais après
 * le premier rendu.
 */
export function ForgeOverlay({ etape }: { etape: EtapeForge }) {
  const enChaine = etape.disposition === "chaine";
  const enRangee = etape.disposition === "rangee";
  /* Une liste qui ouvre des fiches doit leur laisser une colonne : posée
     par-dessus, la fiche recouvrirait justement la case qu'on survole. */
  const aFiche = !!etape.pieces || !!etape.gemmes;

  return (
    <div
      className={`rpg-lp-forge ${enChaine ? "is-chaine" : ""} ${enRangee ? "is-rangee" : ""} ${
        aFiche ? "a-fiche" : ""
      }`}
    >
      {/* La colonne libre : l'explication s'y installe, et la fiche la
          recouvre au survol — l'une n'est utile que tant que l'autre dort. */}
      {etape.explication ? (
        <div className="rpg-lp-explique">
          <h3>{etape.explication.titre}</h3>
          {etape.explication.texte.map((phrase) => (
            <p key={phrase.slice(0, 24)}>{phrase}</p>
          ))}
        </div>
      ) : null}

      {etape.pieces ? <Chaine pieces={etape.pieces} apercus={etape.apercus} /> : null}

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
              <span className="rpg-lp-tip" aria-hidden>
                <ItemFiche fiche={FICHES[gemme.fiche]} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * La chaîne de fabrication, et la fiche qui la suit.
 *
 * L'enclume est derrière, assourdie et hors flux : elle dit de quel atelier il
 * s'agit sans jamais disputer la lecture des quatre pièces, qui sont le sujet.
 * Elle est décorative au sens strict — retirée, la scène perd son atmosphère
 * et pas une information.
 */
function Chaine({
  pieces,
  apercus,
}: {
  pieces: PieceForge[];
  apercus?: EtapeForge["apercus"];
}) {
  const derniere = pieces[pieces.length - 1];

  return (
    <>
      <span className="rpg-lp-forge-enclume" aria-hidden>
        <Image
          src="/game/profession/forge-work.avif"
          alt=""
          fill
          sizes="(min-width: 1400px) 520px, 40vw"
          className="object-contain"
        />
      </span>

      <ol className="rpg-lp-chaine">
        {pieces.map((piece, i) => (
          <li key={piece.art} className="rpg-lp-chaine-case has-tip" tabIndex={0}>
            <span className="rpg-lp-chaine-num">{`0${i + 1}`}</span>
            <span className="rpg-lp-chaine-art">
              <Image
                src={piece.art}
                alt=""
                fill
                sizes="(min-width: 1400px) 200px, 14vw"
                className="object-contain"
              />
            </span>
            <b className={`rpg-lp-chaine-nom is-${piece.rarete}`}>{piece.nom}</b>
            <span className="rpg-lp-chaine-role">{piece.role}</span>
            <span className="rpg-lp-forge-fiche is-survol" aria-hidden>
              <ItemFiche fiche={FICHES[piece.fiche]} />
            </span>
          </li>
        ))}
      </ol>

      {apercus?.length ? (
        <ul className="rpg-lp-apercus">
          {apercus.map((apercu) => (
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
      ) : null}

      <span className="rpg-lp-forge-fiche is-defaut" aria-hidden>
        <ItemFiche fiche={FICHES[derniere.fiche]} />
      </span>
    </>
  );
}
