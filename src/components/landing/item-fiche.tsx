import Image from "next/image";
import type { Fiche, StatCle } from "@/lib/landing/fiches";

/**
 * La fiche d'un objet, rendue en HTML — et non photographiée.
 *
 * C'était une capture. Une image ne monte pas en taille : au double elle
 * bavait, et c'est précisément la fiche qu'on veut pouvoir agrandir, puisque
 * c'est là qu'on lit ce qu'une pièce vaut. En HTML, elle se met à l'échelle
 * sans perdre un pixel et pèse quelques centaines d'octets au lieu de huit
 * kilos.
 *
 * Le balisage et les classes sont **ceux du jeu**, repris à l'identique —
 * `item-tooltip-content.tsx` et son bloc de style. La duplication est assumée :
 * porter le composant réel aurait demandé `@rpg/shared`, les gemmes, les
 * raretés, les panoplies et la comparaison d'équipement, quand la vitrine ne
 * dépend de rien, ce qui est ce qui lui permettra de partir dans son dépôt.
 *
 * Cinq étages, toujours dans le même ordre : identité, statistique principale,
 * secondaires, sertissage, ensemble. Cette régularité est le fond de
 * l'affaire — passé les premières minutes, un joueur ne lit plus sa fiche, il
 * sait où poser les yeux. Les étages absents disparaissent au lieu de réserver
 * une place vide : une ressource tient en un tiers de la hauteur d'une pièce
 * légendaire, et cette différence de volume raconte à elle seule sa richesse.
 */

const STAT: Record<StatCle | "durability", { label: string; art: string; pourcent?: boolean }> = {
  attack: { label: "Attaque", art: "/game/UI/pages/inventaire/sections/inventory-arms.avif" },
  defense: { label: "Armure", art: "/game/UI/pages/inventaire/sections/defense.avif" },
  parade: {
    label: "Parade",
    art: "/game/UI/pages/inventaire/sections/parade.avif",
    pourcent: true,
  },
  crit: {
    label: "Critique",
    art: "/game/UI/pages/inventaire/sections/inventory-armor.avif",
    pourcent: true,
  },
  hp: { label: "Vie", art: "/game/UI/pages/inventaire/sections/vie.avif" },
  durability: { label: "Durabilité", art: "/game/UI/pages/inventaire/sections/durability.avif" },
};

/** La brume de rareté, derrière l'en-tête. Le mythique emprunte celle du légendaire. */
const BRUME: Record<Fiche["rarete"], string> = {
  uncommon: "/game/UI/pages/inventaire/slots/bg-slots-green.avif",
  rare: "/game/UI/pages/inventaire/slots/bg-slots-rare.avif",
  epic: "/game/UI/pages/inventaire/slots/bg-slot-epic.avif",
  legendary: "/game/UI/pages/inventaire/slots/bg-slots-legendary.avif",
  mythic: "/game/UI/pages/inventaire/slots/bg-slots-legendary.avif",
};

const RARETE: Record<Fiche["rarete"], string> = {
  uncommon: "Peu commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique",
};

function valeur(stat: StatCle, n: number) {
  return `+${n}${STAT[stat].pourcent ? " %" : ""}`;
}

function Icone({ stat, px }: { stat: StatCle | "durability"; px: number }) {
  return (
    <Image
      src={STAT[stat].art}
      alt=""
      width={px}
      height={px}
      className="shrink-0 object-contain"
      style={{ width: px, height: px }}
    />
  );
}

export function ItemFiche({ fiche }: { fiche: Fiche }) {
  const rarete = `rpg-rarity-${fiche.rarete}`;

  return (
    <div className="rpg-tooltip">
      {/* ── 1. Identité ─────────────────────────────────────────────────── */}
      <div className="rpg-tooltip-head">
        <Image
          src={BRUME[fiche.rarete]}
          alt=""
          fill
          sizes="304px"
          className="pointer-events-none select-none object-cover"
        />
        <span aria-hidden className="rpg-tooltip-head-veil" />

        <span className="rpg-tooltip-thumb">
          <Image src={fiche.art} alt="" fill sizes="64px" className="object-contain" />
        </span>

        <span className="rpg-tooltip-ident">
          <span className={`rpg-tooltip-name ${rarete}`}>{fiche.nom}</span>
          <span className={`rpg-tooltip-sub ${rarete}`}>
            {RARETE[fiche.rarete]}
            <span className="rpg-tooltip-sub-sep"> · </span>
            <span className="text-parchment-200">{fiche.nature}</span>
          </span>

          <span className="rpg-tooltip-ident-foot">
            <span className="rpg-tooltip-meta rpg-tooltip-gate-on">
              {fiche.niveau ? `Équiper : niveau ${fiche.niveau}` : ""}
            </span>
            {/* Les châsses tiennent la ligne du niveau : alignées sur elle et
                non flottant en haut, elles cessent de disputer le nom. */}
            {fiche.chasses ? (
              <span className="rpg-tooltip-sockets">
                {Array.from({ length: fiche.chasses }, (_, i) => {
                  const gemme = fiche.gemmes?.[i];
                  return (
                    <span
                      key={i}
                      className={`rpg-socket-pip ${gemme ? "rpg-socket-pip-on" : ""}`}
                    >
                      {gemme ? (
                        <Image
                          src={gemme.art}
                          alt=""
                          fill
                          sizes="20px"
                          className="select-none object-contain"
                        />
                      ) : null}
                    </span>
                  );
                })}
              </span>
            ) : null}
          </span>

          <span className="rpg-tooltip-meta rpg-tooltip-gate-on">{fiche.metier}</span>
        </span>
      </div>

      <div className="rpg-tooltip-body">
        {/* ── 1 bis. Ce que la pierre donnera une fois sertie ────────────── */}
        {fiche.pierre ? (
          <div className="rpg-tooltip-gem">
            <span className="rpg-tooltip-gem-pip">
              <Image src={fiche.art} alt="" fill sizes="28px" className="object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="rpg-tooltip-gem-label block">Une fois sertie</span>
              <span className="rpg-tooltip-gem-value block">{fiche.pierre}</span>
            </span>
          </div>
        ) : null}

        {/* ── 2. Statistique principale ─────────────────────────────────── */}
        {fiche.principale ? (
          <div className="rpg-tooltip-hero">
            <Icone stat={fiche.principale.stat} px={34} />
            <span className="min-w-0 flex-1">
              <span className="rpg-tooltip-hero-label block">
                {STAT[fiche.principale.stat].label}
              </span>
              <span className="rpg-tooltip-hero-value block">
                {valeur(fiche.principale.stat, fiche.principale.valeur)}
              </span>
            </span>
          </div>
        ) : null}

        {/* ── 3. Statistiques secondaires ───────────────────────────────── */}
        {fiche.secondaires?.length || fiche.durabilite ? (
          <div className="rpg-tooltip-stats">
            {fiche.secondaires?.map((entree) => (
              <span key={entree.stat} className="rpg-tooltip-stat">
                <Icone stat={entree.stat} px={16} />
                <span className="rpg-tooltip-stat-label">{STAT[entree.stat].label}</span>
                <span className="rpg-tooltip-stat-value">
                  {valeur(entree.stat, entree.valeur)}
                </span>
              </span>
            ))}
            {/* La durabilité ferme la liste au lieu de l'ouvrir : c'est un état
                d'entretien, pas une qualité de la pièce. */}
            {fiche.durabilite ? (
              <span className="rpg-tooltip-stat is-muted">
                <Icone stat="durability" px={16} />
                <span className="rpg-tooltip-stat-label">Durabilité</span>
                <span className="rpg-tooltip-stat-value">
                  {fiche.durabilite[0]} / {fiche.durabilite[1]}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}

        {/* ── 4. Sertissage ─────────────────────────────────────────────── */}
        {fiche.gemmes?.length ? (
          <div className="rpg-tooltip-block">
            <span className="rpg-tooltip-title">Gemmes serties</span>
            <ul className="rpg-tooltip-gems">
              {fiche.gemmes.map((gemme, i) => (
                <li key={i}>
                  <span className="rpg-tooltip-gem-icon">
                    <Image
                      src={gemme.art}
                      alt=""
                      fill
                      sizes="24px"
                      className="select-none object-contain"
                    />
                  </span>
                  <span className="rpg-tooltip-gem-name">{gemme.nom}</span>
                  <span className="rpg-tooltip-gem-stat">{gemme.effet}</span>
                </li>
              ))}
            </ul>
            {fiche.primes?.length ? (
              <ul className="rpg-tooltip-gem-bonuses">
                {fiche.primes.map((prime) => (
                  <li key={prime.label} className="rpg-tooltip-gem-on">
                    <span className="truncate">{prime.label}</span>
                    <span className="shrink-0 tabular-nums">{prime.texte}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {/* ── 5. Ensemble ───────────────────────────────────────────────── */}
        {fiche.ensemble ? (
          <div className="rpg-tooltip-block">
            <span className="rpg-tooltip-set-head">
              <span className="rpg-tooltip-title">Bonus d&apos;ensemble</span>
              <span className="rpg-tooltip-set-badge">{fiche.ensemble.portees}/12</span>
            </span>
            <span className={`rpg-tooltip-set-name ${rarete}`}>{fiche.ensemble.nom}</span>
            {/* Trois états et non deux : « atteint » et « pas atteint »
                mettaient le palier suivant — celui qu'on peut viser ce soir —
                au même niveau que le dernier, qui demande sept pièces de plus. */}
            <div className="flex flex-col gap-0.5">
              {fiche.ensemble.paliers.map((palier) => {
                const acquis = fiche.ensemble!.portees >= palier.pieces;
                const prochain =
                  !acquis &&
                  fiche.ensemble!.paliers.find((p) => p.pieces > fiche.ensemble!.portees)
                    ?.pieces === palier.pieces;
                const etat = acquis ? "acquis" : prochain ? "prochain" : "lointain";
                return (
                  <span key={palier.pieces} className={`rpg-set-tier rpg-set-tier-${etat}`}>
                    <span aria-hidden className="rpg-set-tier-mark">
                      {acquis ? "✓" : prochain ? "→" : ""}
                    </span>
                    <span className="rpg-set-tier-count">({palier.pieces})</span>
                    <span className="rpg-set-tier-label">{palier.label}</span>
                    <span className="rpg-set-tier-value">{palier.valeur}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}

        {fiche.flavour ? <p className="rpg-tooltip-flavour">{fiche.flavour}</p> : null}

        {/* Le poinçon ferme la fiche : c'est la signature d'un objet, et une
            signature se pose en dernier. */}
        {fiche.poincon ? <p className="rpg-tooltip-stamp">{fiche.poincon}</p> : null}
      </div>
    </div>
  );
}
