"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { surOuvertureBeta } from "@/lib/landing/beta-bus";
import { mesurer } from "@/lib/landing/mesure";
import { BETA, EMBLEME } from "@/lib/landing/page";
import { BetaForm } from "./beta-form";

/**
 * La fenêtre d'inscription.
 *
 * Un `dialog` et non le `div role="dialog"` de la loupe, malgré la
 * ressemblance : la loupe montre une image, celle-ci demande une saisie. Ce
 * que l'élément natif apporte — le piège à tabulation, l'inertie du fond,
 * Échap — ne se voit que sur un formulaire, où l'on tabule vraiment et où
 * sortir du champ par le bas pour atterrir dans la page de derrière est un
 * abandon d'inscription.
 *
 * Elle emprunte en revanche tout le reste à la loupe : même voile sombre,
 * même flou, mêmes deux animations. Une seconde fenêtre modale qui se
 * comporterait autrement que la première serait une seconde grammaire.
 */

/** Le temps du fondu de sortie. Doit rester égal à celui du CSS. */
const SORTIE_MS = 200;

export function BetaModale() {
  const dialogue = useRef<HTMLDialogElement>(null);
  const minuterie = useRef<number | undefined>(undefined);
  const [ouverte, setOuverte] = useState(false);
  const [visites, setVisites] = useState(0);

  const fermer = useCallback(() => {
    const el = dialogue.current;
    if (!el?.open) return;
    window.clearTimeout(minuterie.current);
    el.classList.add("is-sortie");
    minuterie.current = window.setTimeout(() => {
      el.classList.remove("is-sortie");
      el.close();
      setOuverte(false);
    }, SORTIE_MS);
  }, []);

  useEffect(
    () =>
      surOuvertureBeta(() => {
        const el = dialogue.current;
        if (!el || el.open) return;
        window.clearTimeout(minuterie.current);
        el.classList.remove("is-sortie");
        /* Un formulaire neuf à chaque ouverture. Sans cette clé, qui a refermé
           après une faute de frappe retrouve son message d'erreur en rouvrant,
           et croit que la page a gardé son échec en mémoire. */
        setVisites((n) => n + 1);
        setOuverte(true);
        el.showModal();
        mesurer("beta_ouverture");
      }),
    [],
  );

  /* `showModal()` rend le fond inerte, mais ne l'empêche pas de défiler : la
     molette continue de faire courir la vitrine derrière la fenêtre, et l'on
     ressort ailleurs qu'à l'endroit où l'on était entré. */
  useEffect(() => {
    if (!ouverte) return;
    const debordement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = debordement;
    };
  }, [ouverte]);

  useEffect(() => () => window.clearTimeout(minuterie.current), []);

  return (
    <dialog
      ref={dialogue}
      className="rpg-lp-beta-modale"
      aria-labelledby="rpg-lp-beta-titre"
      /* Échap ferme nativement, et sèchement. On reprend la main pour lui
         accorder les deux cents millisecondes du fondu, comme aux deux autres
         façons de sortir. */
      onCancel={(evenement) => {
        evenement.preventDefault();
        fermer();
      }}
      /* La boîte occupe tout l'écran : ce qui n'est pas le panneau est le
         fond, et le clic dessus ferme. Le clic sur le panneau ne remonte pas
         jusqu'ici — on y écrit, on ne le traverse pas. */
      onClick={(evenement) => {
        if (evenement.target === dialogue.current) fermer();
      }}
    >
      <div className="rpg-lp-beta-panneau">
        {/* Muet : le nom est écrit juste en dessous, et un lecteur d'écran qui
            annoncerait « Rakorn » deux fois de suite ferait douter d'avoir bien
            entendu la première.
            Chargé sans attendre, alors qu'il est invisible : une fenêtre
            fermée est en `display: none`, et l'image différée ne partirait
            donc chercher son fichier qu'au premier clic — l'emblème
            apparaîtrait après le panneau. Il pèse trois kilooctets. */}
        <Image
          src={EMBLEME}
          alt=""
          width={256}
          height={256}
          loading="eager"
          className="rpg-lp-beta-embleme"
        />
        <p className="rpg-lp-beta-surtitre">Rakorn</p>
        <h2 id="rpg-lp-beta-titre" className="rpg-lp-beta-titre">
          {BETA.titre}
        </h2>
        <p className="rpg-lp-beta-texte">{BETA.texte}</p>

        <BetaForm key={visites} />

        {/* Dernier dans le balisage, et non premier : `showModal()` donne le
            foyer au premier élément atteignable, et l'on veut que ce soit le
            champ — pas la croix qui referme. */}
        <button
          type="button"
          className="rpg-lp-beta-fermer"
          onClick={fermer}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
}
