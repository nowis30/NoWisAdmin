# Validation V2 - Phase 5 (Contrat) + Phase 6 (QA ciblee)

Date: 2026-03-29

## Phase 5 - Tests de contrat

### Objectif
Valider de facon executable le contrat entre le payload publie par NoWisAdmin et le runtime public site-nowis-web.

### Actions implementees
- Script admin: `scripts/contract-payload.test.ts`
  - Valide la structure du payload avec schema.
  - Valide les domaines autorises pour les styles:
    - `style.contentWidth`
    - `style.verticalSpacing`
    - `style.contentAlign`
    - `style.headingScale`
    - `style.mobileSpacing`
    - `style.mobileAlign`
- Script runtime: `scripts/admin-runtime-contract.test.ts`
  - Valide les fallbacks runtime (`image.fit`, `image.aspectRatio`, styles visuels).
  - Valide le parsing des styles custom, y compris les cles mobiles bornees.

### Commandes executees
- `NoWisAdmin`: `npm run test:contract` -> OK (6 pages validees)
- `site-nowis-web`: `npm run test:contract` -> OK
- `NoWisAdmin`: `npm run type-check` -> OK
- `site-nowis-web`: `npm run type-check` -> OK

### Ecart detecte puis corrige
- Ecart runtime sur `mobileSpacing`/`mobileAlign` dans `getAdminSectionVisualStyle`.
- Correction appliquee dans `site-nowis-web/src/lib/admin-runtime.ts`.
- Regression TypeScript `objectFit` corrigee dans `site-nowis-web/src/screens/HomeScreen.tsx`.

Conclusion Phase 5: VALIDE.

## Phase 6 - QA ciblee (home, musique, videos, contact)

### Perimetre
- Pages controlees:
  - `src/app/page.tsx` (home)
  - `src/app/musique/page.tsx`
  - `src/app/videos/page.tsx`
  - `src/app/contact/page.tsx`

### Verifications ciblees
- Presence de resolution runtime admin par page (`getAdminRuntimePayload`, `getAdminPage`, `getAdminSection`).
- Presence de fallback explicite si payload indisponible ou section absente.
- Sanitization de CTA/href (liens internes ou protocoles http/https selon le contexte).
- Application des styles visuels via `getAdminSectionVisualStyle` avec domaines bornes.

### Resultat par page
- Home: OK
  - Fallback textes/CTA/images en place.
  - Hero/trust/process controles par section active.
- Musique: OK
  - Hero admin + fallback explicites.
  - Liens CTA bornees en interne pour eviter des href invalides.
- Videos: OK
  - Hero admin + fallback explicites.
  - Validation href stricte avec fallback securise.
- Contact: OK
  - Hero/direct/social avec fallback explicite.
  - Email et href controles via fonctions de selection defensives.

### Risques residuels
- QA visuelle manuelle multi-breakpoints non automatisee dans ce lot.
- Absence de screenshot diff automatise (hors perimetre V2 demande).

Conclusion Phase 6: VALIDE (QA code-level et comportement de fallback), avec recommandation d'une passe visuelle manuelle finale avant release.

## Addendum - Verrouillage fidelite musique

- Ecart de fidelite detecte puis corrige:
  - `style.mobileSpacing` et `style.mobileAlign` etaient parses mais pas pleinement appliques sur le runtime musique.
  - Correction appliquee sur:
    - `site-nowis-web/src/components/marketing/PageHero.tsx`
    - `site-nowis-web/src/app/musique/page.tsx`
- Validation post-correction:
  - `site-nowis-web`: `npm run type-check` -> OK
  - `site-nowis-web`: `npm run test:contract` -> OK

Documents de verification operationnelle:
- `NoWisAdmin/docs/v2-musique-fidelity-report.md`
- `NoWisAdmin/docs/v2-musique-manual-qa-checklist.md`
