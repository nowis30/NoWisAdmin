# NoWisAdmin

NoWisAdmin est une application d administration privee separee de `site-nowis-web`.

Elle sert a gerer visuellement :

- les textes principaux du site
- les sections activables ou non
- la bibliotheque media
- les reglages de theme
- une base de publication/snapshot propre

## Choix techniques

- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite locale par defaut pour isoler l admin au demarrage
- Auth simple par email/mot de passe + cookie HTTP-only signee en JWT

## Pourquoi une base separee par defaut

`site-nowis-web` utilise deja Prisma sur une base PostgreSQL de production avec un historique de migrations reelles.

Pour ne rien casser dans l existant, NoWisAdmin demarre avec une base SQLite locale minimaliste. Les modeles et conventions ont ete nommes pour permettre ensuite une evolution vers :

1. une base partagee dediee au contenu
2. une API lue par `site-nowis-web`
3. un package partage pour les types et contrats

## Structure

```txt
NoWisAdmin/
├── app/
│   ├── (admin)/
│   │   ├── appearance/
│   │   ├── content/
│   │   ├── dashboard/
│   │   ├── media/
│   │   ├── preview/
│   │   └── sections/
│   ├── api/
│   │   ├── auth/
│   │   └── media/
│   ├── login/
│   ├── globals.css
│   └── layout.tsx
├── components/
├── lib/
├── prisma/
├── public/
│   └── uploads/
└── types/
```

## Modeles Prisma

Le schema couvre la base logique demandee :

- `SiteSetting`
- `ThemeSetting`
- `Page`
- `Section`
- `MediaAsset`
- `ContentBlock`
- `PublishSnapshot`
- `AdminUser`

## Fonctionnement actuel

### Tableau de bord
- vue d ensemble des pages, sections, medias et blocs

### Gestion du contenu
- edition des titres, sous-titres, descriptions, CTA et blocs de contenu par section

### Gestion des images
- televersement local dans `public/uploads`
- bibliotheque media visible dans l interface
- association d une image a une section depuis la page Sections

### Gestion de l apparence
- edition des couleurs principales
- edition des reglages globaux du site

### Gestion des sections
- activation/desactivation
- tri manuel via `sortOrder`
- selection d une image associee

### Apercu et publication
- creation de snapshots JSON en base
- payload visible dans l interface

## Integration future avec site-nowis-web

L integration n est pas branchee automatiquement. La base est prete pour le faire ensuite de facon propre.

Options recommandees :

1. exposer une API de lecture cote NoWisAdmin pour le contenu publie
2. deplacer ensuite les types de `types/site.ts` dans un package partage du workspace
3. faire lire `site-nowis-web` depuis les snapshots publies ou directement depuis les tables de contenu

Conventions deja preparees :

- slugs de page explicites (`home`, etc.)
- cles de section stables (`home.hero`, `home.services`)
- contrat de payload d integration dans `types/site.ts`

## Installation

```bash
cd NoWisAdmin
copy .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Identifiants de depart

Definis dans `.env` :

- `NOWIS_ADMIN_DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `ADMIN_JWT_SECRET`

## Points a brancher plus tard

- stockage media externe si besoin
- vraie publication vers `site-nowis-web`
- partage de types/configs au niveau du workspace
- roles multi-admin si un jour necessaire