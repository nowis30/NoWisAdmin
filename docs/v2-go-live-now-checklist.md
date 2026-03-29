# V2 - Go Live Now Checklist

Date: 2026-03-29

## Objectif
Mettre en ligne maintenant avec un niveau de fiabilite V2 solide, sans etre bloque par l absence d image hero.

## Etat de base (deja valide)
- Commits pushes sur `main`:
  - NoWisAdmin
  - site-nowis-web
- Validations techniques vertes:
  - NoWisAdmin: `npm run type-check` + `npm run test:contract`
  - site-nowis-web: `npm run type-check` + `npm run test:contract`

## Rappel quality gate (actuel)
- L absence d image hero sur pages critiques est un `warning` (plus un blocage).
- Les blocages reels restent actifs:
  - titre de page manquant
  - page sans section
  - section sans titre
  - CTA incomplet
  - lien CTA invalide
  - section vide/cassee

## Execution immediate (ordre recommande)

1. Ouvrir NoWisAdmin en production
- Aller sur `Preview` et verifier rapidement Home, Musique, Videos, Contact, Commander une chanson.

2. Aller sur `Publication`
- Verifier les warnings affiches.
- Confirmer qu aucun `blocking` n est present.

3. Publier
- Ajouter une note de publication claire (ex: "V2 solide sans image hero obligatoire").
- Cliquer `Publier maintenant`.

4. Smoke test public (5 min)
- Verifier en prod:
  - page home
  - page musique
  - page videos
  - page contact
  - page commander-une-chanson
- Verifier:
  - chargement sans erreur
  - CTA principaux cliquables
  - mise en page acceptable sans image hero

5. Check mobile rapide
- Sur mobile (ou emulateur):
  - home + musique
  - verifier alignement/espacement lisibles

## Plan de repli (si souci)
- Revenir au dernier snapshot de publication stable depuis NoWisAdmin.
- Corriger la section concernee.
- Republier avec note explicite.

## Hors scope V2 (non fait volontairement)
- Visual diff automatise screenshot.
- E2E complet Playwright multi-breakpoint.
