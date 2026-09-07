/**
 * La mesure d'audience.
 *
 * Les deux balises de Google, écrites telles qu'il les donne, et non passées
 * par `next/script`. La différence ne se voit pas dans un navigateur — les
 * deux finissent par charger — mais elle décide de tout pour qui vérifie
 * l'installation : en `afterInteractive`, le routeur d'app ne met rien dans le
 * HTML servi, seulement de quoi injecter les balises après l'hydratation. Un
 * vérificateur qui lit la page sans exécuter de JavaScript n'y trouve donc
 * rien, et annonce une balise absente sur un site où elle fonctionne.
 *
 * L'argument qui avait fait choisir `afterInteractive` — ne pas retarder le
 * premier écran — était mal posé : `async` est précisément la forme qui ne
 * bloque pas l'analyse du document. C'est d'ailleurs pourquoi Google l'écrit
 * ainsi.
 *
 * Rien n'est posé hors production. En développement, chaque rechargement
 * comptait une visite : après une semaine de travail sur la page, les chiffres
 * du premier mois auraient d'abord mesuré son auteur.
 */

/* L'identifiant part dans un script en clair. Il vient d'une variable qu'on
   écrit soi-même, mais une valeur mal recopiée — un guillemet égaré — casserait
   la page entière plutôt que la seule mesure. */
const FORME = /^G-[A-Z0-9]+$/;

export function Analytics() {
  const marqueur = process.env.NEXT_PUBLIC_GA_ID;
  if (process.env.NODE_ENV !== "production" || !marqueur || !FORME.test(marqueur)) {
    return null;
  }

  return (
    <>
      {/* React remonte les scripts `async` dans l'en-tête de lui-même. */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${marqueur}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${marqueur}');`,
        }}
      />
    </>
  );
}
