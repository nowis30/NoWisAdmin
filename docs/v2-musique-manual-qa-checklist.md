# V2 Musique - Checklist QA manuelle (fiabilite percue)

Date: 2026-03-29

## But
Verifier en conditions d usage que le rendu musique est fiable, clair et sous controle entre admin et site public.

## Environnement cible
- Runtime public musique: http://localhost:3000/musique
- Admin preview: http://localhost:3001/preview

## Pre-check
- Verifier qu au moins une section hero et une section songs-grid existent pour la page musique dans l admin.
- Verifier que les styles bornes suivants sont disponibles:
  - contentWidth
  - verticalSpacing
  - contentAlign
  - headingScale
  - mobileSpacing
  - mobileAlign

## Scenario A - Coherence desktop
1. Ouvrir l admin preview sur la page musique en mode desktop.
2. Noter visuellement:
  - alignement du hero
  - densite verticale du hero
  - largeur de la grille chansons
  - alignement du titre de grille
3. Ouvrir le runtime public musique en desktop.
4. Comparer les memes points.

Criteres GO:
- Alignement hero coherent admin/public.
- Densite hero proche admin/public (pas d inversion ou decalage evident).
- Grille et titre de section alignes de maniere equivalente.

## Scenario B - Coherence mobile
1. Dans l admin, regler musique.hero et musique.songs-grid:
  - mobileSpacing = compact
  - mobileAlign = center
2. Sauvegarder section puis attendre autosave/sauvegarde OK.
3. Ouvrir runtime public musique en largeur mobile (emulation device ou fenetre reduite).
4. Verifier:
  - hero centré en mobile
  - grille titre centré en mobile
  - densite visiblement plus compacte
5. Refaire avec:
  - mobileSpacing = airy
  - mobileAlign = left
6. Reverifier sur runtime mobile.

Criteres GO:
- Chaque changement mobile est visible sur runtime.
- Retour a inherit restaure le comportement principal (desktop-driven).
- Aucun comportement incoherent (ex: centre en admin mais gauche en runtime).

## Scenario C - Fallback de securite
1. Vider un champ hero non critique (ex: secondaryCta.label) dans l admin.
2. Verifier que runtime utilise la valeur fallback attendue sans casser la page.
3. Remettre une valeur invalide de lien interne pour CTA secondaire.
4. Verifier que runtime ne casse pas la navigation (fallback href).

Criteres GO:
- Pas de casse UI.
- Fallbacks textes/liens actifs comme prevu.

## Scenario D - Controle publication
1. Aller sur la page publication admin.
2. Verifier que les messages quality gate sont lisibles et actionnables.
3. Confirmer que le bouton publier reste bloque si un blocage est present.

Criteres GO:
- Message de blocage comprehensible.
- Action attendue claire avant publication.

## Verdict
- GO release V2 musique si A+B+C+D passent.
- NO-GO si un ecart mobile admin/runtime persiste.

## Hors scope V2 (note seulement)
- Automatisation screenshot diff.
- Assertion e2e Playwright multi-breakpoint.
