# NoWisAdmin

NoWisAdmin est le studio de pages visuel de NoWis pour piloter le site public sans toucher au code.

Objectif produit V2: un outil quotidien fiable, clair et rassurant, avec un vrai flux brouillon -> apercu -> publication.

## Navigation

L interface est organisee en 6 espaces clairs:

1. Tableau de bord
2. Pages
3. Medias
4. Couleurs et style
5. Previsualisation
6. Publication

## Etat V2 (finalisation)

Ce qui est en place:

- Edition par page et section (desktop-first, souris)
- Deplacement, duplication, masquage, suppression de sections
- Edition image avec cadrage, zoom, focal point et apercu immediat
- Apercu proche production avec pages et devices
- Autosave visible (saving/saved/error/retry)
- Quality gate publication (blocking, warning, suggestion)
- Contrat admin/runtime valide par scripts de test

## Documentation utile

- Rapport de finalisation: `docs/nowisadmin-final-report.md`
- Validation V2 phases 5-6: `docs/v2-phase5-phase6-validation.md`
- Fidelite runtime musique: `docs/v2-musique-fidelity-report.md`
- Checklist QA musique: `docs/v2-musique-manual-qa-checklist.md`
- Checklist go-live immediate: `docs/v2-go-live-now-checklist.md`

## Audit de reference (site public)

Un audit complet de site-nowis-web est disponible ici:

- docs/site-nowis-audit.md

Ce document sert de base pour aligner l admin sur les vraies pages et sections du site public.

## Parcours recommande

1. Ouvrir Pages
2. Choisir une page (Accueil, Musique, Videos, Ateliers, Contact, etc. selon tes donnees)
3. Cliquer sur une section
4. Modifier titre, sous-titre, texte, bouton, lien, image, couleur de fond, couleur de texte, visibilite
5. Voir le rendu en direct dans l apercu a droite
6. Ouvrir Previsualisation pour verifier l ensemble
7. Ouvrir Publication pour publier la version

## Ce qui a ete simplifie

- Vocabulaire plus humain (moins de termes techniques)
- Edition par page puis section
- Cartes de sections visuelles avec action Modifier
- Editeur de section en 2 colonnes: reglages a gauche, apercu live a droite
- Gestion des couleurs plus explicite (usage de chaque couleur + exemple visuel)
- Bibliotheque medias avec:
  - miniatures
  - usages connus (ou l image est utilisee)
  - choix rapide pour une section
  - remplacement direct d image
- Publication separee de la previsualisation pour un parcours plus clair

## Nouveau modele de sections (base sur le site reel)

NoWisAdmin utilise maintenant un modele de sections metier:

- hero
- cards
- process
- trustStrip
- contactInfo
- socialLinks
- finalCta
- generic

Chaque type affiche seulement les champs utiles pour reproduire les sections reelles du site.

## Compatibilite avec site-nowis-web

NoWisAdmin conserve un payload de publication stable pour la future lecture par site-nowis-web.

Le contrat principal est toujours genere dans la previsualisation et enregistre lors de la publication.

Le site public lit le payload admin avec fallback de securite pendant la transition.

## Stack technique

- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL (via NOWIS_ADMIN_DATABASE_URL)

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

Puis ouvrir http://localhost:3000.

## Variables importantes

Definies dans .env:

- NOWIS_ADMIN_DATABASE_URL
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_NAME
- ADMIN_JWT_SECRET
- ADMIN_SEED_TOKEN (optionnel, route seed)
- ALLOW_ADMIN_SEED_IN_PROD (optionnel, doit etre `true` pour autoriser seed en production)

## Routes principales

- /dashboard
- /content
- /media
- /appearance
- /preview
- /publish

## APIs principales

- POST /api/admin/section-editor
- POST /api/admin/site-settings
- POST /api/admin/theme-settings
- POST /api/admin/publish
- POST /api/media/upload
- POST /api/media/replace
