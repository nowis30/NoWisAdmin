# V2 Musique - Rapport de fidelite runtime

Date: 2026-03-29

## Objectif
Confirmer que le rendu runtime de la page musique reste coherent avec le comportement attendu de l editeur admin (fiabilite, clarte, controle), sans ouvrir de chantier hors scope V2.

## Comparaison musique reel vs runtime (avant correction)

### Ecart 1 - Styles mobiles bornes ignores sur le hero
- Constat:
  - Le runtime parse bien `style.mobileSpacing` et `style.mobileAlign`.
  - Le composant hero public n appliquait pas ces deux cles.
- Impact usage:
  - Incoherence possible entre ce qui est regle dans l admin et ce qui apparait en mobile.
  - Perte de confiance "ce que je vois dans le studio = ce qui sera publie".

### Ecart 2 - Styles mobiles bornes ignores sur la grille musique
- Constat:
  - La section `musique.songs-grid` appliquait largeur, spacing desktop et align desktop.
  - Les overrides mobiles (`mobileSpacing`, `mobileAlign`) n etaient pas appliques.
- Impact usage:
  - Risque de densite ou d alignement inattendu sur mobile.
  - Sensation de controle reduite pour les reglages responsives.

## Corrections appliquees (scope V2 strict)

### Correction A - Hero shared runtime
- Fichier: `site-nowis-web/src/components/marketing/PageHero.tsx`
- Action:
  - Extension du contrat `style` local avec:
    - `mobileSpacing: 'inherit' | 'compact' | 'comfortable' | 'airy'`
    - `mobileAlign: 'inherit' | 'left' | 'center'`
  - Ajout de mapping runtime:
    - `mobileSpacingClass(...)`
    - `alignClass(contentAlign, mobileAlign)`
  - Application des classes mobiles dans le wrapper du hero.

### Correction B - Page musique runtime
- Fichier: `site-nowis-web/src/app/musique/page.tsx`
- Action:
  - Ajout des helpers:
    - `mobileSpacingClass(...)`
    - `alignClass(contentAlign, mobileAlign)`
  - Application des classes sur la section grille (`musique.songs-grid`).
  - Alignement mobile force selon reglage admin, tout en conservant le fallback `'inherit'`.

## Validation executee

### Verifications techniques
- `site-nowis-web`: `npm run type-check` -> OK
- `site-nowis-web`: `npm run test:contract` -> OK

### Resultat
- Le contrat runtime reste stable.
- Le rendu musique consomme maintenant les reglages mobiles bornes la ou ils etaient ignores.
- Pas de regression detectee au niveau typage/contrat.

## Risques residuels (acceptes V2)
- Pas de diff visuel automatise screenshot-to-screenshot dans ce lot.
- Validation visuelle finale mobile/desktop reste recommandee en passe manuelle avant release.

## Idees utiles mais hors scope V2 (notees, non implementees)
- Ajout d un test visuel automatise (Playwright snapshots) pour musique hero + songs-grid.
- Ajout d un indicateur runtime "style source" (defaults vs admin overrides) pour debug interne.
