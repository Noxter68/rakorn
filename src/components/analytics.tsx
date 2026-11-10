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

// Cet identifiant public appartient à la landing et doit être présent dans
// le HTML de production, même si l'hébergeur ne fournit aucune variable.
const MARQUEUR = "G-KJHTXL8ZNX";

export function Analytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      {/* React remonte les scripts `async` dans l'en-tête de lui-même. */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${MARQUEUR}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${MARQUEUR}');`,
        }}
      />
    </>
  );
}
