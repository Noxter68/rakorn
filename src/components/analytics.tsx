import Script from "next/script";

/**
 * La mesure d'audience.
 *
 * `next/script` en `afterInteractive` plutôt que deux balises dans le `head` :
 * le marqueur de Google pèse une centaine de kilooctets et n'a rien à
 * apprendre d'une page que personne n'a encore vue. Placé dans le `head`, il
 * se met en travers du premier rendu — sur une vitrine dont le premier écran
 * est une illustration plein format, c'est le seul chargement qui compte.
 *
 * Rien n'est posé hors production. En développement, chaque rechargement
 * comptait une visite : au bout d'une semaine de travail sur la page, les
 * chiffres du premier mois auraient d'abord mesuré son auteur.
 */
export function Analytics() {
  const marqueur = process.env.NEXT_PUBLIC_GA_ID;
  if (process.env.NODE_ENV !== "production" || !marqueur) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${marqueur}`}
        strategy="afterInteractive"
      />
      <Script id="rpg-lp-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${marqueur}');`}
      </Script>
    </>
  );
}
