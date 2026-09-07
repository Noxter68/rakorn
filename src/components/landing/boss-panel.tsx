import Image from "next/image";
import type { Boss } from "@/lib/landing/campagne";

/**
 * Le panneau de droite, emprunté à la fiche de créature du jeu.
 *
 * Le portrait en grand tient le haut, comme dans la fiche : c'est lui qu'on
 * regarde d'abord, et le reste se lit ensuite. Une version antérieure le
 * réduisait à un médaillon de trois centimètres — c'était réglé pour éviter
 * qu'il montre son rectangle, et le remède coûtait plus que le mal. Ici le
 * rectangle disparaît autrement : l'image se fond par le bas dans le panneau,
 * et le panneau la porte au lieu de la subir.
 *
 * Puis l'ordre du jeu, sans y toucher : ce qu'il est, ce qu'il fait, ses
 * chiffres, ce qu'il rapporte. Cet ordre n'est pas décoratif — c'est celui
 * qu'un joueur a appris à lire, et le reprendre tel quel est la manière la plus
 * courte de dire « voilà l'écran que vous aurez ».
 */
export function BossPanel({ boss }: { boss: Boss }) {
  return (
    <aside className="rpg-lp-boss">
      <div className="rpg-lp-boss-scene">
        <Image
          src={boss.art}
          alt=""
          fill
          sizes="(min-width: 1400px) 420px, 32vw"
          className="rpg-lp-boss-art object-cover"
        />
        <span aria-hidden className="rpg-lp-boss-fondu" />
        <span className="rpg-lp-boss-chip">
          Boss · niv. {boss.niveau}
        </span>
      </div>

      <div className="rpg-lp-boss-corps">
        <p className="rpg-lp-boss-nom">{boss.nom}</p>
        <p className="rpg-lp-boss-zone">
          {boss.chapitre} · {boss.zone}
        </p>

        <ul className="rpg-lp-boss-traits">
          {boss.traits.map((trait) => (
            <li key={trait.nom}>
              <Image src={trait.art} alt="" width={20} height={20} className="object-contain" />
              <b>{trait.nom}</b>
              <span>{trait.quoi}</span>
            </li>
          ))}
        </ul>

        <ul className="rpg-lp-boss-chiffres">
          <li>
            <b>{boss.attaque}</b>
            <span>Attaque</span>
          </li>
          <li>
            <b>{boss.armure}</b>
            <span>Armure</span>
          </li>
          <li>
            <b>{boss.parade}</b>
            <span>Parade</span>
          </li>
          <li>
            <b className="is-vie">{boss.vie.toLocaleString("fr-FR")}</b>
            <span>Vie</span>
          </li>
          <li className="is-large">
            <b className="is-xp">+{boss.xp.toLocaleString("fr-FR")}</b>
            <span>Expérience</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
