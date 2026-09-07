import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * La racine du projet, dite explicitement.
 *
 * Next la devine en cherchant le lockfile le plus proche, et remonte tant
 * qu'il en trouve : sur une machine où traînent un `package-lock.json` dans le
 * dossier personnel et un `pnpm-lock.yaml` un cran plus haut, il choisit l'un
 * des deux et prévient qu'il n'en est pas sûr. Chez l'hébergeur le dépôt est
 * seul et la question ne se pose pas — mais autant qu'elle ne se pose nulle
 * part.
 */
const RACINE = __dirname;

/**
 * Un mois en production, une minute en développement.
 *
 * Les illustrations ne portent pas d'empreinte dans leur nom : remplacer une
 * image ne change pas son URL, et un cache long tient donc l'ancienne à
 * l'écran. En production le compromis se défend, les assets bougeant peu ; en
 * local il rend le travail sur les images impraticable — et c'est précisément
 * le travail auquel cette app est destinée.
 */
const ASSET_MAX_AGE = isProd ? 60 * 60 * 24 * 30 : 60;

const nextConfig: NextConfig = {
  turbopack: { root: RACINE },
  outputFileTracingRoot: RACINE,
  images: {
    minimumCacheTTL: ASSET_MAX_AGE,
    // Une source déjà en AVIF repasserait par WebP faute de ce réglage :
    // décodage puis réencodage, une compression avec perte de plus, pour un
    // rendu plus flou qu'en servant l'AVIF tel quel.
    formats: ["image/avif", "image/webp"],
    /**
     * Les qualités que l'optimiseur accepte.
     *
     * Next 16 ne les prend plus au vol : une valeur absente de cette liste
     * passe encore, mais en criant à chaque image — seize avertissements par
     * chargement de page, un par décor. Soixante-quinze est le défaut ; les
     * décors plein écran demandent quatre-vingt-deux, parce qu'à cette taille
     * les dégradés de ciel se cassent en bandes visibles sous le voile.
     */
    qualities: [75, 82],
  },
  async headers() {
    return [
      {
        // `public/` sort par défaut en `max-age=0` : chaque navigation repayait
        // un aller-retour de revalidation par image.
        source: "/game/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ASSET_MAX_AGE}, stale-while-revalidate=86400`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
