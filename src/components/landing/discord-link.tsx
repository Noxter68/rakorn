import { DISCORD } from "@/lib/landing/page";
import { DiscordIcon } from "./discord-icon";

/**
 * Le lien vers le serveur, où qu'il soit posé.
 *
 * Un `a` et non un bouton : il y a une vraie destination au bout, qu'on doit
 * pouvoir ouvrir dans un onglet ou copier depuis la barre d'état. Il s'ouvre
 * dans un nouvel onglet — on part sur Discord, on ne quitte pas la page — et
 * porte le libellé complet en `aria-label` pour le cas, dans la barre, où
 * seule l'icône est visible.
 */
export function DiscordLink({
  className,
  children,
}: {
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={DISCORD.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={DISCORD.titre}
      title={DISCORD.titre}
    >
      <DiscordIcon />
      {children}
    </a>
  );
}
