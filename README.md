# NoWisAdmin

NoWisAdmin est un editeur visuel simple pour gerer le contenu et l apparence du site.

Objectif UX: une personne non technique doit pouvoir modifier photos, textes, couleurs, boutons et sections sans jargon ni logique technique.

Contraintes V1:

- interface tres simple et tres visuelle
- pas de fonctions gadgets
- pas d options avancees inutiles
- pas de jargon developpeur dans l interface
- pas d ecrans surcharges
- apercu visuel prioritaire

## Navigation

L interface est organisee en 6 espaces clairs:

1. Tableau de bord
2. Pages
3. Medias
4. Couleurs et style
5. Previsualisation
6. Publication

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

## Stack technique

- Next.js 14 + App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite (par defaut)

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
