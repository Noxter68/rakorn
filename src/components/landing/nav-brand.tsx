"use client";

/**
 * Le logo de la barre, qui ramène en haut sans laisser de trace.
 *
 * Il reste un lien et non un bouton : on doit pouvoir l'ouvrir dans un onglet,
 * le viser au clavier, et le suivre si le JavaScript n'a pas chargé. Mais
 * `#hero` est la seule ancre de la page qui ne désigne rien — elle pointe le
 * haut du document, là où `/` mène déjà. Écrite dans l'URL, elle y reste : le
 * rechargement la garde, la barre d'adresse la complète toute seule, et l'URL
 * qu'on partage n'est plus la bonne. Les sept autres ancres nomment une
 * section et méritent d'y figurer ; celle-ci, non.
 *
 * On la retire donc une fois le saut fait. `replaceState` n'ajoute pas d'étape
 * à l'historique : le bouton « précédent » ramène où il ramenait avant.
 */
export function NavBrand({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#hero"
      className="rpg-lp-nav-brand"
      onClick={() => {
        /* Après le tour de boucle, pour que le navigateur ait pris son saut :
           nettoyer l'URL avant qu'il ne l'ait lue l'annulerait. */
        requestAnimationFrame(() => {
          history.replaceState(null, "", location.pathname + location.search);
        });
      }}
    >
      {children}
    </a>
  );
}
