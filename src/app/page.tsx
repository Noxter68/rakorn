import type { Metadata } from "next";
import { ApercuScene } from "@/components/landing/apercu-scene";
import { AutresScene } from "@/components/landing/autres-scene";
import { BetaModale } from "@/components/landing/beta-modal";
import { CampagneScene } from "@/components/landing/campagne-scene";
import { CarteScene } from "@/components/landing/carte-scene";
import { CombatScene } from "@/components/landing/combat-scene";
import { EquipementScene } from "@/components/landing/equipement-scene";
import { FinalScene } from "@/components/landing/final-scene";
import { GuildeScene } from "@/components/landing/guilde-scene";
import { HeroScene } from "@/components/landing/hero-scene";
import { MarcheScene } from "@/components/landing/marche-scene";
import { MetiersScene } from "@/components/landing/metiers-scene";
import { ScrollDirector } from "@/components/landing/scroll-director";
import { Topnav } from "@/components/landing/topnav";

export const metadata: Metadata = {
  title: "Rakorn — le RPG où l'économie appartient aux joueurs",
  description:
    "Huit métiers, 461 objets, 313 recettes. Récoltez, forgez, vendez : à Rakorn, aucun marchand ne fixe les prix — c'est vous.",
};

/**
 * La vitrine.
 *
 * Onze scènes, chacune d'une hauteur d'écran, chacune bâtie sur la même règle :
 * le décor prend toute la place, les onglets se tiennent en haut, le titre en
 * bas à gauche, ce qu'il faut en savoir en bas à droite, et rien ne flotte
 * par-dessus qui ne démontre quelque chose.
 *
 * Aucune requête, aucune session : la page est entièrement statique, et c'est
 * ce qui lui permet d'être servie par n'importe quoi le jour où elle partira
 * dans son propre dépôt. Le seul code client est le chef d'orchestre du
 * défilement et les onglets — voir `ScrollDirector` et `TabbedScene`.
 */
export default function LandingPage() {
  return (
    <>
      <ScrollDirector />
      <Topnav />
      <main className="rpg-lp">
        <HeroScene />
        <MetiersScene />
        <MarcheScene />
        <EquipementScene />
        <CombatScene />
        <CampagneScene />
        <CarteScene />
        <GuildeScene />
        <AutresScene />
        <ApercuScene />
        <FinalScene />
      </main>
      {/* Une seule fenêtre pour les trois appels — barre du haut, ouverture,
          clôture. Ils ne partagent rien d'autre que ce qu'ils déclenchent. */}
      <BetaModale />
    </>
  );
}
