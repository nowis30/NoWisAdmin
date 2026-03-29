# NoWisAdmin Product Roadmap (Audit + Plan Executable)

## 1) Resume executif

NoWisAdmin a deja une base solide pour un produit reel:
- edition par pages/sections avec preview live,
- media library et remplacement d'images,
- publication avec snapshots,
- integration runtime reelle avec site-nowis-web.

Mais dans son etat actuel, il reste un bon outil interne V1, pas encore un editeur visuel competitif face a des solutions payantes.

Le levier principal pour devenir competitif n'est pas d'ajouter 100 options, mais de construire 4 piliers:
1. moteur visuel robuste (canvas + styles + responsive),
2. composants/blocs reutilisables et gouvernes,
3. workflow pro (autosave, revisions, rollback fiable, approvals),
4. experience premium orientee vitesse et anti-casse.

## 2) Audit produit actuel

### 2.1 Forces deja presentes

- UX V1 claire, vocabulaire non technique, bon cadrage non-dev.
- Structure pages/sections compréhensible dans l'editeur principal.
- Drag/drop des sections, duplication, visibilite, status DRAFT/PUBLISHED.
- Preview section en direct + preview globale.
- Image editing deja bien lance (focus/zoom/fit/ratio + modal studio).
- Publication snapshot existante et stable.
- Contrat runtime admin -> site-nowis-web en place.

### 2.2 Faiblesses actuelles

- Pas de vrai "moteur de layout" multi-device (reglages par breakpoint absents).
- Pas de systeme de composants reutilisables de niveau produit (instances vs definitions).
- Versioning encore minimal (snapshot sans diff riche ni rollback par page/section).
- Pas d'autosave, pas d'undo/redo global fiable.
- Preview globale encore "liste de sections" plus que "rendu credibilise".
- Gouvernance faible (roles, permissions fines, activity log, approvals).
- CMS structure encore centree section blocks; collections metier limitees.
- Productivite pro absente (command palette, shortcuts, batch actions, templates de page).

### 2.3 Score de maturite (1-5)

- Edition visuelle: 2.8/5
- Blocs/composants reutilisables: 2.1/5
- Responsive: 1.8/5
- Images/medias: 3.1/5
- Workflow pro: 2.4/5
- Design system: 2.5/5
- CMS structure: 2.3/5
- Securite d'usage anti-casse: 2.7/5
- Vitesse de travail: 2.2/5
- Apparence premium: 2.9/5

## 3) Architecture cible (produit)

## 3.1 Domaines fonctionnels cibles

1. Editor Core
- Canvas renderer, selection engine, property engine, command bus.

2. Content Model
- Page, SectionInstance, BlockInstance, CollectionItem, GlobalSection.

3. Component System
- BlockDefinition, Variant, Preset, Slot mapping, constraints.

4. Visual System
- Tokens (couleurs, typo, spacing), semantic styles, theme packs.

5. Workflow System
- Draft workspace, autosave, revisions, approvals, releases, rollback.

6. Governance
- Roles, permissions, locks, audit trail.

## 3.2 Data model cible (evolution Prisma)

Ajouter progressivement:
- Revision (page-level and site-level revisions)
- Release (published release metadata)
- ComponentDefinition / ComponentVariant / ComponentInstance
- Collection / CollectionItem / FieldSchema
- UserRole / Permission / ActivityLog
- DraftSession / Lock

Principes:
- separation "content" vs "presentation" vs "workflow",
- snapshots immuables pour rollback fiable,
- referential integrity forte pour eviter la casse de production.

## 3.3 Rendering architecture cible

- Unifier les styles de section dans un helper unique runtime (contentWidth, spacing, align, headingScale, image style, etc.).
- Definir un "render contract" versionne (schema JSON) entre admin et site public.
- Ajouter validation schema avant publication (gate quality).

## 3.4 Modules actuels a faire evoluer en priorite

- app/(admin)/content/page.tsx
- components/editor/page-editor.tsx
- components/editor/section-editor.tsx
- components/editor/live-preview.tsx
- components/editor/media-picker.tsx
- app/(admin)/preview/page.tsx
- app/(admin)/publish/page.tsx
- app/api/admin/section-editor/route.ts
- app/api/admin/page-builder/route.ts
- app/api/admin/publish/route.ts
- lib/admin-data.ts
- lib/site-section-model.ts
- prisma/schema.prisma
- cote site public: src/lib/admin-runtime.ts + pages runtime (hero/grid/contact/song)

## 4) Matrice priorisee des fonctionnalites

Echelle:
- Complexite: S / M / L / XL
- Priorite: P0 / P1 / P2 / P3
- Timing: Now / Next / Later

| Feature | Probleme resolu | Valeur utilisateur | Complexite | Priorite | Timing |
|---|---|---|---|---|---|
| Autosave intelligent par section | Perte de modifs | Confiance + vitesse | M | P0 | Now |
| Undo/Redo cross-panneaux | Erreurs de manipulation | Securite d'edition | L | P0 | Next |
| Revisions page (timeline) | Rollback limite | Workflow pro | L | P0 | Next |
| Rollback 1-clic par page | Risque de casse | Recuperation immediate | M | P0 | Next |
| Preview "production-like" (iframe style) | Preview peu credible | Decision publication fiable | M | P0 | Now |
| Breakpoints per-device (mobile/tablet/desktop) | Responsive fragile | Controle visuel reel | L | P0 | Next |
| Constraints layout (safe bounds) | Casse layout | Anti-casse fort | M | P0 | Next |
| Block definitions + variants | Duplication ad hoc | Reutilisation massive | XL | P1 | Next |
| Global sections reutilisables | Incoherence inter-pages | Coherence marque | L | P1 | Next |
| Template de page metier | Lenteur creation pages | Productivite | M | P1 | Now |
| Command palette | Navigation lente | Vitesse pro | M | P1 | Next |
| Raccourcis clavier editor | Friction repetitive | Gain temps | S | P1 | Now |
| Media usage graph + replace safe | Impact media incertain | Evite regressions | M | P1 | Now |
| Crop presets + smart focal | Qualite visuelle variable | Hero credible rapide | M | P1 | Now |
| Structured collections CMS | Blocks trop libres | Donnees metier robustes | XL | P1 | Later |
| Validation schema avant publish | Publis cassantes | Qualite + confiance | M | P1 | Now |
| Quality checklist par page | Oublis frequents | Fiabilite livraison | S | P1 | Now |
| Permissions RBAC | Risque operationnel | Gouvernance equipe | L | P1 | Later |
| Activity log (qui a fait quoi) | Traçabilite absente | Pilotage equipe | M | P1 | Next |
| Comments internes par section | Aller-retours externes | Collaboration | M | P2 | Next |
| Lock de section (soft lock) | Conflits edition | Securite multi-user | M | P2 | Later |
| Design tokens semantiques | Styles disperses | Coherence design | M | P1 | Next |
| Theme packs (preset system) | Branding lent | Time-to-brand rapide | S | P2 | Next |
| Block presets metier Nowis | Setup long | Valeur immediate domaine | M | P1 | Now |
| Diff visual avant publication | Validation difficile | Pro workflow | L | P2 | Later |

## 5) Roadmap par niveaux

## Niveau 1 - Indispensable (foundation product)

Objectif: fiabilite + valeur immediate sans rupture d'architecture.

- Autosave section + indicateur d'etat (saved/saving/error).
- Preview final beaucoup plus realiste.
- Validation pre-publish (schema + liens + images manquantes).
- Responsive controls de base (3 devices + safe bounds).
- Revisions page + rollback simple.

Resultat attendu:
- outil fiable au quotidien,
- baisse massive du risque de casse,
- ressenti "pro" instantane.

## Niveau 2 - Tres fort (productivity + structure)

- Command palette + shortcuts.
- Templates de page + presets de section metier.
- Bibliotheque blocs avec variants reutilisables.
- Media graph (usages + impact preview avant remplacement).
- Design tokens semantiques centralises.

Resultat attendu:
- vitesse de production x2,
- coherence visuelle augmentee,
- moins de dette manuelle.

## Niveau 3 - Premium competitif

- Revision timeline complete (site/page/section).
- Visual diff avant publication.
- CMS collections structurees (songs, videos, services, testimonials, faq).
- Role/permission system + activity log.
- Workflow d'approbation (draft -> review -> publish).

Resultat attendu:
- competitivite vis-a-vis d'outils payants pour PME/creator teams.

## Niveau 4 - Differenciation Nowis

- "Studio Assist" anti-casse contextuel (guardrails intelligents).
- Presets metier Nowis (musique/media/ateliers) pre-configures.
- Publication confidence score (quality gate score).
- Local/production sync visual with runtime health checks.

Resultat attendu:
- outil unique adapte au contexte reel Nowis,
- simplicite forte pour non-techniques sans perdre la puissance.

## 6) V2 / V3 / V4 cible

## V2 (8-12 semaines)
- Niveaux 1 complets + premiers quick wins niveau 2.
- Focus: fiabilite, responsive, preview credible, revision de base.

## V3 (12-20 semaines)
- composant system, productivite avancee, design tokens matures.
- Focus: vitesse et standardisation equipe.

## V4 (20+ semaines)
- CMS structure + gouvernance + differentiators.
- Focus: outil competitif monnayable/professionnel.

## 7) Quick wins immediats (haute valeur / risque modere)

1. Autosave section + badge etat.
2. Validation pre-publish (liens invalides, image absente, bloc vide critique).
3. Responsive preset safe (mobile/tablet/desktop) dans l'editeur section.
4. Preview final "real page" avec styles runtime reel.
5. Media impact panel avant replace.
6. Commandes clavier de base (save, duplicate, move section).
7. Templates de page pour home/musique/videos/contact.
8. Checklist qualite personnalisable par type de page.
9. Section globales hero/footer reutilisables (phase 1 simple).
10. Activity feed minimal (last edited by/time/action).

## 8) Gros chantiers structurants

1. Moteur de composants definition/instance/variant.
2. CMS collections structurees et relations.
3. Revision system complet + visual diff.
4. RBAC + audit log + approval workflow.
5. Runtime contract versioning + migration tooling.

## 9) Recommandations UX/UI premium

- Canvas central prioritaire, side panels compactes et contextuelles.
- Inline editing texte (click-to-edit) dans le rendu.
- Selection states ultra clairs (hover, active, locked, inherited).
- Property panel organise par tabs: Content / Layout / Style / Media / Advanced.
- Micro-feedback systematique: saved, dirty, warning, blocked.
- One-click actions frequentes en sticky toolbar.
- Eviter surcharge: progressive disclosure (base -> avance).

## 10) Recommandations techniques

- Introduire une couche "Editor Command Bus" pour unifier actions + undo/redo.
- Definir un schema zod versionne pour publish payload + validation gate.
- Mettre en place tests de contrat runtime (admin payload -> site render).
- Decoupler le rendu preview de l'editeur via composants partages.
- Instrumenter performance (long tasks editor, payload size, image load).

## 11) Risques techniques et mitigations

- Risque: explosion de complexite UI.
  - Mitigation: progressive disclosure + niveaux de fonctionnalites.

- Risque: regression runtime public.
  - Mitigation: contract tests + feature flags + fallback strict.

- Risque: schema drift entre admin et site.
  - Mitigation: versioning payload + migration plan.

- Risque: dette de performance.
  - Mitigation: memoization editor, virtualization lists, image optimization policy.

## 12) Ce qu'il faut absolument eviter

1. Ajouter des options visuelles sans guardrails.
2. Multiplier des panneaux sans logique d'information architecture.
3. Introduire des features enterprise avant d'avoir fiabilise autosave/revision.
4. Coupler trop fort UI editor et runtime final sans contrat versionne.
5. Complexifier la creation de page pour non-techniques.

## 13) Top 10 ameliorations strategiques

1. Autosave + recovery.
2. Revision timeline + rollback page.
3. Responsive controls with safe bounds.
4. Preview production-like.
5. Validation gate avant publish.
6. Component definitions + variants.
7. Global reusable sections.
8. CMS collections structurees.
9. Command palette + shortcuts.
10. Activity log + RBAC basique.

## 14) Les 3 meilleures ameliorations a lancer maintenant

## 1. Autosave + Recovery + status system
- Pourquoi: plus gros gain confiance/usage immediat.
- Impact visuel: fort (etat clair, moins de stress).
- Risque: modere.

## 2. Preview final realiste + validation pre-publish
- Pourquoi: evite publication cassante.
- Impact visuel: tres fort (credibilite produit).
- Risque: modere.

## 3. Responsive controls bornes (device presets + constraints)
- Pourquoi: valeur directe sur rendu final credible mobile/desktop.
- Impact visuel: tres fort.
- Risque: moyen mais gerable par bornes strictes.

## 15) Ce qui rapproche le plus vite d'un outil competitif

- Enchainement optimal court terme:
1. fiabilite edition (autosave + rollback),
2. fiabilite livraison (preview realiste + quality gate),
3. fiabilite rendu final (responsive borne).

Cet enchainement cree rapidement une promesse claire: "editer vite, publier sans peur".

## 16) Plan d'execution recommande (humain)

1. Valider officiellement cette roadmap et figer le scope V2 (12 semaines).
2. Ouvrir un board de delivery avec epics: Autosave, Preview+Validation, Responsive.
3. Ajouter les migrations Prisma pour revisions et activity log minimal.
4. Implementer le command bus editor (base pour autosave et undo/redo futur).
5. Ajouter autosave section avec etats UX (saving/saved/error/retry).
6. Refaire la page Preview pour un rendu proche production et non liste technique.
7. Ajouter un quality gate pre-publish bloqueur avec messages actionnables.
8. Implementer controls responsive bornes par device dans l'editeur.
9. Ecrire tests de contrat payload runtime entre admin et site-nowis-web.
10. Faire une phase QA reelle sur 4 pages cibles: home, musique, videos, contact.
11. Definir les presets metier Nowis (3 packs) pour accelerer l'usage non-tech.
12. Planifier V3 uniquement apres stabilisation V2 (telemetrie + feedback usage).
