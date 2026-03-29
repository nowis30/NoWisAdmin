import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; next?: string } }) {
  const hasError = searchParams?.error === '1';
  const hasServiceError = searchParams?.error === 'service';

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel overflow-hidden p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-pine/70">NoWisAdmin</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-ink">Une admin separee, nette et durable.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Gere les textes, les medias, les sections actives et l apparence de ton site public sans toucher au code a chaque changement.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ['Contenu', 'Titres, sous-titres, descriptions, liens et blocs de contenu.'],
              ['Media', 'Bibliotheque simple et association des images aux sections.'],
              ['Theme', 'Couleurs centrales et reglages visuels reutilisables.'],
              ['Publication', 'Base propre pour apercu, snapshot et synchronisation future.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-8 lg:p-10">
          <div className="inline-flex rounded-full bg-pine/10 p-3 text-pine">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-ink">Connexion admin</h2>
          <p className="mt-2 text-sm text-slate-600">Session privee securisee par cookie HTTP-only et mot de passe hache en base.</p>

          <form action="/api/auth/login" method="post" className="mt-8 space-y-5">
            <input type="hidden" name="next" value={searchParams?.next ?? '/dashboard'} />
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="admin@nowis.local" required />
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" placeholder="Ton mot de passe admin" required />
            </div>

            {hasError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Identifiants invalides.
              </div>
            ) : null}

            {hasServiceError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Service de connexion indisponible. Verifie NOWIS_ADMIN_DATABASE_URL sur Vercel puis redeploie.
              </div>
            ) : null}

            <button type="submit" className="button-primary w-full">Se connecter</button>
          </form>

          <p className="mt-6 text-xs leading-6 text-slate-500">
            Pour la premiere connexion, utilise les identifiants seeds dans le fichier .env local de l application admin.
            Voir aussi le <Link href="https://nextjs.org/docs" className="font-semibold text-pine">guide Next.js</Link> si tu veux etendre le projet.
          </p>
        </section>
      </div>
    </main>
  );
}