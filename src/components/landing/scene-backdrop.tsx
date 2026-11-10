import Image from "next/image";

/**
 * Le décor plein écran, et son fondu d'un onglet à l'autre.
 *
 * Toutes les sources sont montées d'emblée et empilées ; seule l'opacité
 * change. C'est ce qui permet un fondu franc : monter l'image au moment du
 * clic ferait attendre le réseau, et l'on verrait le décor disparaître avant
 * que le suivant arrive.
 *
 * Les sources en double sont fondues en une seule — quatre onglets qui
 * partagent le même décor ne doivent pas donner quatre calques identiques à
 * peindre.
 *
 * Les décors ne passent pas par l'optimiseur : ils sont déjà en AVIF et à une
 * taille qui n'excède pas ce que la page en demande. Un second encodage avec
 * perte ne rendrait pas une image plus nette.
 *
 * Le voile est la pièce maîtresse et non un détail : les illustrations du jeu
 * sont contrastées, et sans lui aucun texte blanc ne tiendrait par-dessus. Il
 * assombrit par le bas, où le titre se pose, et par la gauche, où il commence.
 */
export function SceneBackdrop({
  sources,
  mobileSources,
  active = 0,
  cadrage,
  priority = false,
}: {
  sources: string[];
  mobileSources?: string[];
  active?: number;
  /** `object-position`, quand le centre de l'image n'est pas le bon endroit. */
  cadrage?: string;
  /** Réservé à l'ouverture : c'est la seule image qui doit précéder le reste. */
  priority?: boolean;
}) {
  const uniques = [...new Set(sources.map((source, i) => `${source}\u0000${mobileSources?.[i] ?? ""}`))];
  const actif = Math.max(0, uniques.indexOf(`${sources[active] ?? sources[0]}\u0000${mobileSources?.[active] ?? ""}`));

  return (
    <div className="rpg-lp-backdrop" aria-hidden>
      {uniques.map((paire, i) => {
        const [art, mobile] = paire.split("\u0000");
        return (
          <div key={paire} className={`rpg-lp-backdrop-layer ${i === actif ? "is-on" : ""}`}>
            <Image src={art} alt="" fill sizes="100vw" priority={priority && i === 0}
              unoptimized className={`rpg-lp-backdrop-art ${mobile ? "is-desktop" : ""}`}
              style={cadrage ? { objectPosition: cadrage } : undefined} />
            {mobile && <Image src={mobile} alt="" fill sizes="(max-width: 900px) 390px, 1px"
              unoptimized className="rpg-lp-backdrop-art is-mobile" />}
          </div>
        );
      })}
      <span className="rpg-lp-backdrop-veil" />
    </div>
  );
}
